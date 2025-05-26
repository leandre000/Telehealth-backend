const express = require('express');
const router = express.Router();
const User = require('../models/User');
const isAdmin=require('../middleware/isadmin');

// GET /api/users
router.get('/', isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 