const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');

// GET /api/history — list all conversations (title + id + updatedAt only)
router.get('/', async (req, res) => {
  try {
    const conversations = await Conversation.find({})
      .select('title createdAt updatedAt')
      .sort({ updatedAt: -1 })
      .limit(20);
    res.json(conversations);
  } catch (err) {
    console.error('[History] GET / error:', err);
    res.status(500).json({ error: 'Failed to fetch conversations.' });
  }
});

// GET /api/history/:id — fetch full messages of one conversation
router.get('/:id', async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found.' });
    }
    res.json(conversation);
  } catch (err) {
    console.error('[History] GET /:id error:', err);
    res.status(500).json({ error: 'Failed to fetch conversation.' });
  }
});

// POST /api/history — create a new conversation
router.post('/', async (req, res) => {
  try {
    const title = (req.body && req.body.title) ? String(req.body.title) : 'New Conversation';
    const conversation = new Conversation({ title, messages: [] });
    await conversation.save();
    res.status(201).json(conversation);
  } catch (err) {
    console.error('[History] POST / FULL ERROR:', err);
    res.status(500).json({ error: 'Failed to create conversation.', detail: err.message });
  }
});

// POST /api/history/:id/messages — append a message to a conversation
router.post('/:id/messages', async (req, res) => {
  try {
    const { sender, text } = req.body || {};
    if (!sender || !text) {
      return res.status(400).json({ error: 'sender and text are required.' });
    }
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found.' });
    }
    conversation.messages.push({ sender, text });
    if (conversation.title === 'New Conversation' && sender === 'user') {
      conversation.title = text.length > 40 ? text.slice(0, 40) + '…' : text;
    }
    await conversation.save();
    res.json(conversation);
  } catch (err) {
    console.error('[History] POST /:id/messages FULL ERROR:', err);
    res.status(500).json({ error: 'Failed to save message.', detail: err.message });
  }
});

// DELETE /api/history/:id — delete a conversation
router.delete('/:id', async (req, res) => {
  try {
    await Conversation.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('[History] DELETE /:id error:', err);
    res.status(500).json({ error: 'Failed to delete conversation.' });
  }
});

module.exports = router;
