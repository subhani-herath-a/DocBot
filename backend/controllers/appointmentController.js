
const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const Availability = require('../models/Availability');
const Notification = require('../models/Notification');
const File = require('../models/File');

async function isSlotFree({ doctorId, date, time }) {
  const slot = await Availability.findOne({
    doctorId,
    date,
    time,
    booked: false,
  });
  return !!slot;
}

async function notifyBoth(doctorId, patientId, message) {
  await Notification.insertMany([
    { userId: doctorId, message },
    { userId: patientId, message },
  ]);
}

exports.book = async (req, res) => {
  try {
    const { patientId, doctorId, date, time, reason = '' } = req.body;
    if (!patientId || !doctorId || !date || !time) {
      return res.status(400).json({ msg: 'Missing required fields.' });
    }

    if (!mongoose.isValidObjectId(patientId) || !mongoose.isValidObjectId(doctorId)) {
      return res.status(400).json({ msg: 'Invalid ID supplied.' });
    }

    const free = await isSlotFree({ doctorId, date, time });
    if (!free) {
      return res.status(409).json({ msg: 'Requested slot is not available. Choose another.' });
    }

    let fileUrl = null;
    let fileId = null;

    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`.replace(/\\/g, '/');
      const fileDoc = await File.create({
        filename: req.file.filename,
        filepath: fileUrl,
        uploadedAt: new Date(),
      });
      fileId = fileDoc._id;
      console.log('[File uploaded]', fileDoc);
    }

    console.log('[Booking Appointment]', { patientId, doctorId, date, time, reason, fileUrl });

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      date,
      time,
      reason,
      status: 'scheduled',
      fileUrl,
      fileId,
    });

    await Availability.findOneAndUpdate(
      { doctorId, date, time },
      { $set: { booked: true } }
    );

    await notifyBoth(
      doctorId,
      patientId,
      `New appointment booked on ${date} at ${time}`
    );

    res.status(201).json(appointment);
  } catch (err) {
    console.error('[Book Appointment Error]', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.listAll = async (_req, res) => {
  try {
    const list = await Appointment.find()
      .sort({ date: -1, time: -1 })
      .populate('patientId', 'firstName lastName phone age')
      .populate('doctorId', 'firstName lastName specialty')
      .populate('fileId', 'filename filepath');

    res.json(list);
  } catch (err) {
    console.error('[List All Error]', err);
    res.status(500).json({ msg: err.message });
  }
};

exports.byPatient = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.params.id })
      .populate('doctorId', 'firstName lastName email')
      .populate('fileId', 'filename filepath');

    const now = new Date();
    const enhanced = appointments.map(a => {
      let status = a.status;
      if (status === 'cancelled' || status === 'Cancelled') {
        status = 'Cancelled';
      } else if (new Date(`${a.date}T${a.time}`) < now) {
        status = 'Finished';
      } else {
        status = 'Upcoming';
      }

      return {
        ...a._doc,
        computedStatus: status,
        fileUrl: a.fileUrl || (a.fileId?.filepath || null),
      };
    });

    res.json(enhanced);
  } catch (err) {
    console.error('[By Patient Error]', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.byDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const appointments = await Appointment.find({ doctorId })
      .populate('patientId', 'firstName lastName phone age email')
      .populate('fileId', 'filename filepath')
      .sort({ date: 1 });

    const updated = appointments.map(appt => {
      let fileUrl = appt.fileUrl || (appt.fileId?.filepath || null);
      let computedStatus = appt.status;

      const now = new Date();
      const apptDateTime = new Date(`${appt.date}T${appt.time}`);
      if (appt.status !== 'cancelled' && apptDateTime < now) {
        computedStatus = 'Finished';
      } else if (appt.status !== 'cancelled') {
        computedStatus = 'Upcoming';
      }

      return {
        ...appt._doc,
        fileUrl,
        computedStatus,
        patient: appt.patientId,
      };
    });

    res.json(updated);
  } catch (err) {
    console.error('[By Doctor Error]', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.cancel = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ msg: 'Appointment not found' });

    appt.status = 'cancelled';
    await appt.save();

    await Availability.findOneAndUpdate(
      { doctorId: appt.doctorId, date: appt.date, time: appt.time },
      { $set: { booked: false } }
    );

    await notifyBoth(
      appt.doctorId,
      appt.patientId,
      `Appointment on ${appt.date} at ${appt.time} was cancelled`
    );

    res.json({ msg: 'Cancelled', appointment: appt });
  } catch (err) {
    console.error('[Cancel Error]', err);
    res.status(500).json({ msg: err.message });
  }
};

// exports.reschedule = async (req, res) => {
//   try {
//     const { date, time } = req.body;
//     const appointment = await Appointment.findById(req.params.id);
//     if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

//     if (appointment.date === date && appointment.time === time) {
//       return res.status(400).json({ message: 'New slot is the same as current appointment.' });
//     }

//     const slot = await Availability.findOne({
//       doctorId: appointment.doctorId,
//       date,
//       time,
//       booked: false,
//     });

//     if (!slot) {
//       return res.status(409).json({ message: 'New slot is not available' });
//     }

//     // Unbook previous slot
//     await Availability.findOneAndUpdate(
//       { doctorId: appointment.doctorId, date: appointment.date, time: appointment.time },
//       { $set: { booked: false } }
//     );

//     // Book new slot
//     await Availability.findByIdAndUpdate(slot._id, { booked: true });

//     // Update appointment
//     appointment.date = date;
//     appointment.time = time;
//     appointment.status = 'scheduled';
//     await appointment.save();

//     await notifyBoth(
//       appointment.doctorId,
//       appointment.patientId,
//       `Appointment has been rescheduled to ${date} at ${time}`
//     );

//     res.json({ message: 'Appointment rescheduled successfully' });
//   } catch (err) {
//     console.error('[Reschedule Error]', err);
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };
exports.reschedule = async (req, res) => {
  try {
    const { date, time } = req.body;

    if (!date || !time) {
      return res.status(400).json({ message: 'Date and time are required.' });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Prevent rescheduling to the same slot
    if (appointment.date === date && appointment.time === time) {
      return res.status(400).json({ message: 'New slot is the same as the current appointment.' });
    }

    // Check for past date/time
    const newDateTime = new Date(`${date}T${time}`);
    if (newDateTime < new Date()) {
      return res.status(400).json({ message: 'Cannot reschedule to a past date/time.' });
    }

    // Check if the new slot is free
    const slot = await Availability.findOne({
      doctorId: appointment.doctorId,
      date,
      time,
      booked: false,
    });

    if (!slot) {
      return res.status(409).json({ message: 'New slot is not available' });
    }

    // Unbook previous slot
    await Availability.findOneAndUpdate(
      { doctorId: appointment.doctorId, date: appointment.date, time: appointment.time },
      { $set: { booked: false } }
    );

    // Book new slot
    await Availability.findByIdAndUpdate(slot._id, { booked: true });

    // Update appointment details
    appointment.date = date;
    appointment.time = time;
    appointment.status = 'scheduled';
    await appointment.save();

    // Notify both doctor and patient
    await notifyBoth(
      appointment.doctorId,
      appointment.patientId,
      `Appointment has been rescheduled to ${date} at ${time}`
    );

    res.json({ message: 'Appointment rescheduled successfully', appointment });
  } catch (err) {
    console.error('[Reschedule Error]', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
