const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
const Doctor = require('../models/Doctor');
const appointmentController = require('../controllers/appointmentController');
const Availability = require('../models/Availability');
const authMiddleware = require('../middleware/auth');


console.log('Controller keys:', Object.keys(appointmentController)); 


// router.post('/', appointmentController.book);
const multer = require('multer');

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDFs, JPEGs, PNGs, and WebPs are allowed'));
    }
  }
});

router.post('/', upload.single('file'), (req, res, next) => {
  console.log('File upload attempt:', req.file ? { filename: req.file.filename, mimetype: req.file.mimetype } : 'No file provided'); // Debug
  if (!req.file) {
    console.warn('No file uploaded for appointment');
  }
  next();
}, appointmentController.book);

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
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // 1. Unbook old slot
    await Availability.updateOne(
      {
        doctorId: appointment.doctorId,
        date: appointment.date,
        time: appointment.time,
      },
      { $set: { booked: false } }
    );

    // 2. Check if new slot is available
    const newSlot = await Availability.findOne({
      doctorId: appointment.doctorId,
      date: newDate,
      time: newTime,
      booked: false,
    });

    if (!newSlot) {
      return res.status(409).json({ message: 'Selected time slot is not available' });
    }

    // 3. Book new slot
    await Availability.updateOne(
      { _id: newSlot._id },
      { $set: { booked: true } }
    );

    // 4. Update appointment
    appointment.date = newDate;
    appointment.time = newTime;
    await appointment.save();

    // 5. Optional: Create doctor notification
    await Notification.create({
      userId: appointment.doctorId,
      message: `An appointment has been rescheduled to ${newDate} at ${newTime}.`,
      type: 'appointment',
    });

    res.json({ message: 'Appointment rescheduled successfully', appointment });
  } catch (err) {
    console.error('Reschedule Error:', err);
    res.status(500).json({ message: 'Failed to reschedule appointment' });
  }
};

router.put('/reschedule/:id', appointmentController.reschedule);



module.exports = router;
