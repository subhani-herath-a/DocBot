const MedicalRecord = require('../models/MedicalRecord');

exports.getRecordsByDoctor = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ doctorId: req.params.doctorId })
      .populate('patientId', 'firstName lastName');
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.uploadMedicalRecord = async (req, res) => {
  try {
    const { patientId, doctorId } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    const newRecord = await MedicalRecord.create({
      doctorId,
      patientId,
      filename: file.originalname,
      filepath: file.path,
    });

    res.status(201).json(newRecord);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
