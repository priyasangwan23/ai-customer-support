const express = require('express');
const router = express.Router();
const multer = require('multer');
const faqService = require('../services/faqService');
const aiService = require('../services/aiService');

// Use memoryStorage — we don't process files yet, just accept them
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/chat
// Accepts both application/json and multipart/form-data (file uploads)
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const message = req.body?.message;
    let history = [];
    
    // Parse history if it's sent as a JSON string (via FormData)
    try {
      if (typeof req.body?.history === 'string') {
        history = JSON.parse(req.body.history);
      } else if (Array.isArray(req.body?.history)) {
        history = req.body.history;
      }
    } catch (e) {
      console.warn('[Chat API] Failed to parse history context, using empty array.');
    }

    if (!message || !message.trim()) {
      return res.status(400).json({ reply: 'Please provide a valid question.' });
    }

    const normalizedMessage = message.trim().toLowerCase();

    // Log whether a file was attached (no processing yet — future AI doc analysis)
    if (req.file) {
      console.log(`[Chat API] File received: "${req.file.originalname}" (${req.file.mimetype}) — for future AI doc analysis.`);
    }

    // PHASE 1: Try FAQ match (Fast path)
    const faqAnswer = await faqService.findFAQMatch(normalizedMessage);
    if (faqAnswer) {
      console.log(`[Chat API] FAQ match for: "${normalizedMessage}"`);
      return res.json({ reply: faqAnswer });
    }

    // PHASE 2: Fallback to AI Service for context-aware response
    console.log(`[Chat API] No FAQ match — generating AI fallback for: "${normalizedMessage}"`);
    const aiAnswer = await aiService.generateResponse(normalizedMessage, history);
    
    return res.json({ reply: aiAnswer });

  } catch (error) {
    console.error('[Chat API] Critical Error:', error.stack);
    return res.status(500).json({ reply: 'An internal AI processing error occurred. Please try again or contact support.' });
  }
});

module.exports = router;
