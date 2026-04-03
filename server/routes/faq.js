const express = require('express');
const router = express.Router();
const FAQ = require('../models/FAQ');

// POST /api/faq/add
router.post('/add', async (req, res) => {
  try {
    const { question, answer } = req.body;

    // Validate input
    if (!question || !answer) {
      return res.status(400).json({ error: "Both 'question' and 'answer' are required fields." });
    }

    // Trim and normalize input using .toLowerCase()
    const normalizedQuestion = question.trim().toLowerCase();
    const normalizedAnswer = answer.trim();

    // Prevent duplicate FAQs if possible
    const existingFaq = await FAQ.findOne({ question: normalizedQuestion });

    if (existingFaq) {
      return res.status(409).json({ error: "An FAQ with this question already exists." });
    }

    // Save data to MongoDB using FAQ.create()
    await FAQ.create({
      question: normalizedQuestion,
      answer: normalizedAnswer
    });
    
    // Return success response { message: "FAQ added successfully" }
    return res.status(201).json({ message: "FAQ added successfully" });

  } catch (error) {
    console.error("Error adding FAQ:", error);
    return res.status(500).json({ error: "An internal server error occurred while adding the FAQ." });
  }
});

// POST /api/faq/bulk
router.post('/bulk', async (req, res) => {
  try {
    const { faqs } = req.body;

    if (!Array.isArray(faqs) || faqs.length === 0) {
      return res.status(400).json({ error: "Please provide an array of FAQs in the 'faqs' field." });
    }

    const insertedFaqs = [];
    let skipped = 0;

    for (const item of faqs) {
      if (!item.question || !item.answer) {
        skipped++;
        continue;
      }

      const normalizedQuestion = item.question.trim().toLowerCase();
      const normalizedAnswer = item.answer.trim();

      // Check if it already exists to prevent duplicate
      const existingFaq = await FAQ.findOne({ question: normalizedQuestion });

      if (!existingFaq) {
        const newFaq = await FAQ.create({
          question: normalizedQuestion,
          answer: normalizedAnswer
        });
        insertedFaqs.push(newFaq);
      } else {
        skipped++;
      }
    }

    return res.status(201).json({ 
      message: `Successfully added ${insertedFaqs.length} FAQs.`,
      skipped: skipped,
      inserted: insertedFaqs 
    });

  } catch (error) {
    console.error("Error bulk adding FAQs:", error);
    return res.status(500).json({ error: "An internal server error occurred while adding FAQs." });
  }
});

module.exports = router;
