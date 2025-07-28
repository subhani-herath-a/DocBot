// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const router = express.Router();
// const uploadController = require('../controllers/uploadController');

// // Set up Multer
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   },
// });

// const upload = multer({ storage });

// // POST: Upload record
// router.post('/', upload.single('file'), uploadController.uploadMedicalRecord);

// // GET: Patient's own records (token must include user ID)
// router.get('/records', async (req, res) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   const jwt = require('jsonwebtoken');
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const userId = decoded.id;
//     const records = await require('../models/MedicalRecord').find({ patientId: userId });
//     res.json(records);
//   } catch (err) {
//     res.status(401).json({ message: 'Unauthorized', error: err.message });
//   }
// });

// // GET: Serve file
// router.get('/:filename', (req, res) => {
//   const filePath = path.join(__dirname, '..', 'uploads', req.params.filename);
//   res.download(filePath);
// });

// // GET: Doctor uploads
// router.get('/doctor/:doctorId', uploadController.getRecordsByDoctor);

// module.exports = router;
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const controller = require('../controllers/medicalRecordController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

router.post('/', upload.single('file'), controller.uploadMedicalRecord);
router.get('/doctor/:doctorId', controller.getRecordsByDoctor);
router.get('/:filename', (req, res) => {
  const filePath = path.join(__dirname, '..', 'uploads', req.params.filename);
  res.download(filePath);
});

module.exports = router;
