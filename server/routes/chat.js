const express = require('express');
const router = express.Router();
const faqService = require('../services/faqService');
const aiService = require('../services/aiService');

// POST /api/chat
// Accepts JSON request for faster, more stable conversation
router.post('/', async (req, res) => {
  try {
    const { message, history, fileContext } = req.body;
    let chatHistory = [];
    
    // Safety check for history
    if (Array.isArray(history)) {
      chatHistory = history;
    }

    if (!message || !message.trim()) {
      return res.status(400).json({ reply: 'Please provide a valid question.' });
    }

    const normalizedMessage = message.trim().toLowerCase();

    // Log if file metadata is present
    if (fileContext) {
      console.log(`[Chat API] AI Context attached: ${fileContext.fileName} (${fileContext.fileType})`);
    }

    // PHASE 1: Try FAQ match (Fast path)
    const faqAnswer = await faqService.findFAQMatch(normalizedMessage);
    if (faqAnswer) {
      console.log(`[Chat API] FAQ match for: "${normalizedMessage}"`);
      return res.json({ reply: faqAnswer });
    }

    // PHASE 2: Fallback to AI Service for context-aware response
    console.log(`[Chat API] No FAQ match — generating AI fallback for: "${normalizedMessage}"`);
    const { reply, insights } = await aiService.generateResponse(normalizedMessage, chatHistory, fileContext);
    
    return res.json({ 
      reply, 
      insights: insights || { sentiment: 'Neutral', intent: 'FAQ Query', suggestedAction: 'Assist user' } 
    });

  } catch (error) {
    console.error('[Chat API] Critical Error:', error.stack);
    return res.status(500).json({ reply: 'An internal AI processing error occurred. Please try again or contact support.' });
  }
});

module.exports = router;
