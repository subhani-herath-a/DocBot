const express = require("express");
const Patient = require("../models/Patient");
const bcrypt = require("bcrypt");


const router = express.Router();

// Get patient by ID
router.get("/:id", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).select("-password");
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: "Patient not found" });
  }
});

// Update patient profile
router.put("/:id", async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    const updateData = { ...rest };

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      updateData.password = hashed;
    }

    const updated = await Patient.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

module.exports = router;
