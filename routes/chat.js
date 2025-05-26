const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');

// POST /api/chat
router.post('/', async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;
    const chat = new Chat({ sender, receiver, message });
    await chat.save();
    res.json(chat);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET /api/chat
router.get('/', async (req, res) => {
  try {
    const chats = await Chat.find().sort({ timestamp: -1 });
    res.json(chats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 