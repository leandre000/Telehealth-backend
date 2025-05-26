const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

// Get all appointments for a user
router.get('/', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({
      $or: [
        { patient: req.user.id },
        { doctor: req.user.id }
      ]
    }).sort({ date: -1 });
    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create new appointment
router.post('/', auth, async (req, res) => {
  try {
    const { doctorId, date, notes } = req.body;

    // Check if doctor exists
    const doctor = await User.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ msg: 'Doctor not found' });
    }

    const appointment = new Appointment({
      patient: req.user.id,
      doctor: doctorId,
      date,
      notes
    });

    await appointment.save();
    res.json({message:"Appointment created successfully",appointment:appointment.toObject().id});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update appointment status
router.put('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }

    // Check if user is either the patient or doctor
    if (appointment.patient.toString() !== req.user.id && 
        appointment.doctor.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    appointment.status = status;
    await appointment.save();

    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
