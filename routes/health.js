const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');

function formatHealthMetrics(metrics) {
  return {
    Pregnancies: Number(metrics?.Pregnancies) || 0,
    Glucose: Number(metrics?.Glucose) || 0,
    BloodPressure: Number(metrics?.BloodPressure) || 0,
    SkinThickness: Number(metrics?.SkinThickness) || 0,
    Insulin: Number(metrics?.Insulin) || 0,
    BMI: Number(metrics?.BMI) || 0,
    DiabetesPedigreeFunction: Number(metrics?.DiabetesPedigreeFunction) || 0,
    Age: Number(metrics?.Age) || 0
  };
}

// GET /api/health
router.get('/',auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('healthMetrics');
    if (!user) return res.status(404).json({msg: 'User not found'});
    let prediction = null;
    if (user.healthMetrics) {
      const axios = require('axios');
      const formatted = formatHealthMetrics(user.healthMetrics);
      try {
        const response = await axios.post('http://localhost:8000/predict', formatted);
        prediction = response.data.prediction;
      } catch (e) {
        prediction = null;
      }
    }
    res.json({ healthMetrics: user.healthMetrics, prediction });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST /api/health
router.post('/',auth, async (req, res) => {
  try {
    const { healthMetrics } = req.body;
    const user = await User.findById(req.user.id);
    user.healthMetrics = formatHealthMetrics(healthMetrics);
    await user.save();
    // Call AI model
    const axios = require('axios');
    let prediction = null;
    try {
      const response = await axios.post('http://localhost:8000/predict', user.healthMetrics);
      prediction = response.data.prediction;
    } catch (e) {
      prediction = null;
    }
    res.json({ healthMetrics: user.healthMetrics, prediction });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 