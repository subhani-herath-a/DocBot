
const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const Availability = require('../models/Availability');
const Notification = require('../models/Notification');

async function isSlotFree({ doctorId, date, time }) {
  const blocks = await Availability.find({ doctorId, day: date });

  const insideBlock = blocks.some((b) => {
    return time >= b.start && time < b.end;
  });
  if (!insideBlock) return false;

  const conflict = await Appointment.findOne({
    doctorId,
    date,
    time,
    status: { $in: ['scheduled', 'confirmed'] },
  });
  return !conflict;
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

    if (!patientId || !doctorId || !date || !time)
      return res.status(400).json({ msg: 'Missing required fields.' });

    if (!mongoose.isValidObjectId(patientId) || !mongoose.isValidObjectId(doctorId))
      return res.status(400).json({ msg: 'Invalid ID supplied.' });

    const free = await isSlotFree({ doctorId, date, time });
    if (!free)
      return res
        .status(409)
        .json({ msg: 'Requested slot is not available. Choose another.' });

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      date,
      time,
      reason,
      status: 'scheduled',
    });

    await notifyBoth(
      doctorId,
      patientId,
      `New appointment booked on ${date} at ${time}`
    );

    res.status(201).json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.listAll = async (_req, res) => {
  try {
    const list = await Appointment.find()
      .sort({ date: -1, time: -1 })
      .populate('patientId', 'firstName lastName')
      .populate('doctorId', 'firstName lastName specialty');
    res.json(list);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ FIXED STATUS LOGIC HERE
exports.byPatient = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.params.id })
      .populate('doctorId', 'firstName lastName email');

    const now = new Date();

    const enhanced = appointments.map(a => {
      let status = a.status;

      if (status === 'cancelled' || status === 'Cancelled') {
        // leave as is
      } else {
        const appointmentDateTime = new Date(`${a.date}T${a.time}`);

        if (appointmentDateTime < now) {
          status = 'Finished';
        } else {
          status = 'Upcoming';
        }
      }

      return { ...a._doc, computedStatus: status };
    });

    res.json(enhanced);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.byDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const appointments = await Appointment.find({ doctorId })
      .populate('patientId', 'firstName lastName')
      .sort({ date: 1 });

    res.json(appointments);
  } catch (err) {
    console.error('Error fetching doctor appointments:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.cancel = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ msg: 'Appointment not found' });

    appt.status = 'cancelled';
    await appt.save();

    await notifyBoth(
      appt.doctorId,
      appt.patientId,
      `Appointment on ${appt.date} at ${appt.time} was cancelled`
    );

    res.json({ msg: 'Cancelled', appointment: appt });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
exports.reschedule = async (req, res) => {
  try {
    const { date, time } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    appointment.date = date;
    appointment.time = time;
    appointment.status = 'pending'; // reset to pending for approval if needed
    await appointment.save();

    res.json({ message: 'Appointment rescheduled successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

