
const MedicalRecord = require('../models/MedicalRecord');

exports.uploadMedicalRecord = async (req, res) => {
  try {
    const { patientId, doctorId } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    const record = new MedicalRecord({
      patientId,
      doctorId,
      filename: file.originalname,
      filepath: file.path,
    });

    await record.save();
    res.status(201).json({ message: 'Medical record uploaded', record });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};

exports.getRecordsByPatient = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patientId: req.params.patientId });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRecordsByDoctor = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ doctorId: req.params.doctorId });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
