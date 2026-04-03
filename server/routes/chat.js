const express = require('express');
const router = express.Router();
const faqService = require('../services/faqService');

// POST /api/chat
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ reply: "Please provide a valid question." });
    }

    // Bonus: Normalize user input using .toLowerCase()
    const normalizedMessage = message.trim().toLowerCase();

    // Try finding a matching FAQ using the designated function
    const answer = await faqService.findFAQMatch(normalizedMessage);

    if (answer) {
      // Bonus: Log which path is used
      console.log(`[Chat API] Path: FAQ. Found answer for query: "${normalizedMessage}"`);
      return res.json({ reply: answer });
    } else {
      // Bonus: Log which path is used
      console.log(`[Chat API] Path: Fallback. No match found for query: "${normalizedMessage}"`);
      return res.json({ reply: "I’ll connect you to AI soon" });
    }
  } catch (error) {
    console.error('Error in chat route:', error.message);
    // Safe fallback, do not crash if DB fails
    return res.status(500).json({ reply: "An internal server error occurred while processing your request. I’ll connect you to AI soon." });
  }
});

module.exports = router;
