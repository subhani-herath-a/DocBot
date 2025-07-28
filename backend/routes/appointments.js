const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
const Doctor = require('../models/Doctor');
const appointmentController = require('../controllers/appointmentController');

console.log('Controller keys:', Object.keys(appointmentController)); 


router.post('/', appointmentController.book);

router.get('/',                 appointmentController.listAll);
router.get('/patient/:id',      appointmentController.byPatient);
router.get('/doctor/:id',       appointmentController.byDoctor);
router.delete('/:id',           appointmentController.cancel);
/**
 * GET /api/appointments/patient/:id
 */
exports.byPatient = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.params.id })
      .populate('doctorId', 'firstName lastName email');

    const now = new Date();

    const enhanced = appointments.map(a => {
      const appointmentDateTime = new Date(`${a.date}T${a.time}`);
      let status = a.status;

      if (status === 'cancelled') {
        status = 'Cancelled';
      } else if (appointmentDateTime < now) {
        status = 'Finished';
      } else {
        status = 'Upcoming';
      }

      return {
        ...a._doc,
        computedStatus: status,
        fileUrl: a.file ? `/uploads/${a.file}` : null,  // Include full file URL if exists
      };
    });

    res.json(enhanced);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
exports.reschedule = async (req, res) => {
  const appointmentId = req.params.id;
  const { newDate, newTime } = req.body;

  try {
    const updated = await Appointment.findByIdAndUpdate(
      appointmentId,
      { date: newDate, time: newTime },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Optionally: Add doctor notification
    await Notification.create({
      userId: updated.doctorId,
      message: `An appointment has been rescheduled to ${newDate} at ${newTime}.`,
      type: 'appointment',
    });

    res.json({ message: 'Appointment rescheduled successfully', appointment: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to reschedule appointment' });
  }
};
router.put('/reschedule/:id', appointmentController.reschedule);

// ✅ Get appointments by doctor ID
// router.get('/doctor/:doctorId', async (req, res) => {
//   try {
//     const appointments = await Appointment.find({ doctorId: req.params.doctorId })
//       .populate('patientId', 'firstName lastName email') // if patient ref exists
//       .sort({ date: -1 });

//     res.json(appointments);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch appointments' });
//   }
// });
// router.get('/patient/:id', async (req, res) => {
//   try {
//     const appointments = await Appointment.find({ patientId: req.params.id })
//       .populate('doctorId', 'firstName lastName email');
//     res.json(appointments);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Cancel appointment
// router.delete('/cancel/:id', async (req, res) => {
//   try {
//     const appointment = await Appointment.findById(req.params.id).populate('doctorId patientId');

//     if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

//     const doctor = await Doctor.findById(appointment.doctorId._id);
//     if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

//     // Delete appointment
//     await Appointment.findByIdAndDelete(req.params.id);

//     // Notify doctor
//     const notification = new Notification({
//       userId: doctor.userId,
//       message: `Appointment with ${appointment.patientId.firstName} on ${appointment.date} was cancelled.`,
//       isRead: false,
//     });
//     await notification.save();

//     res.json({ message: 'Appointment cancelled and doctor notified.' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

module.exports = router;
