require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const chatRoutes = require('./routes/chat');
const faqRoutes = require('./routes/faq');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/faq', faqRoutes);

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('DB Connected');
    
    // Seed some initial FAQ data if you want to test
    const FAQ = require('./models/FAQ');
    FAQ.countDocuments()
      .then(count => {
        if (count === 0) {
          FAQ.insertMany([
            { question: "What are your business hours?", answer: "We are open Monday to Friday, 9:00 AM to 5:00 PM." },
            { question: "How can I contact support?", answer: "You can reach us at support@example.com." },
            { question: "Where are you located?", answer: "Our main office is located in San Francisco, CA." }
          ]).then(() => console.log('Seeded initial FAQs database'));
        }
      })
      .catch(err => console.error("Could not seed data:", err));
  })
  .catch(err => {
    console.error(err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
