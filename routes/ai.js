const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/ai/insights
router.post('/insights', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('healthMetrics');
    if (!user) return res.status(404).json({msg: 'User not found'});
    const axios = require('axios');
    let prediction = null;
    let recommendations = [];
    let message = '';
    try {
      const response = await axios.post('http://localhost:5000/predict', user.healthMetrics);
      prediction = response.data.prediction;
      if (prediction === 1) {
        message = 'You are at risk for diabetes.';
        recommendations = [
          'Consult your doctor for further evaluation.',
          'Maintain a healthy diet and exercise regularly.'
        ];
      } else {
        message = 'You are not at risk for diabetes.';
        recommendations = [
          'Continue maintaining a healthy lifestyle.'
        ];
      }
    } catch (e) {
      message = 'Could not get prediction from AI model.';
      recommendations = [];
    }
    res.json({ prediction, message, recommendations });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 