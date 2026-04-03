const FAQ = require('../models/FAQ');

const findFAQMatch = async (userQuery) => {
  try {
    if (!userQuery || typeof userQuery !== 'string') {
      return null;
    }

    const normalizedQuery = userQuery.toLowerCase().trim();

    // Fetch all FAQs from the database
    // Ensure safe fallback if database is empty by defaulting to empty array if something goes wrong but not throwing
    const faqs = await FAQ.find({}) || [];
    console.log(`[DEBUG] Fetched ${faqs.length} FAQs from database for query: "${userQuery}"`);

    if (faqs.length === 0) {
      console.log(`[DEBUG] Database is completely empty or query failed.`);
      return null;
    }

    let bestMatch = null;
    let highestScore = 0;

    for (const faq of faqs) {
      const normalizedQuestion = faq.question.toLowerCase();
      
      // Basic partial mapping check: see if words from query are in the question, or vice versa
      let score = 0;
      
      if (normalizedQuestion === normalizedQuery) {
        score = 100;
      } else if (normalizedQuestion.includes(normalizedQuery)) {
        score = 50 + (normalizedQuery.length / normalizedQuestion.length) * 10;
      } else if (normalizedQuery.includes(normalizedQuestion)) {
        score = 50 + (normalizedQuestion.length / normalizedQuery.length) * 10;
      } else {
        // Evaluate word matches by ignoring common stop words that create false positives
        const stopWords = ['the', 'is', 'at', 'which', 'and', 'on', 'a', 'an', 'to', 'in', 'of', 'for', 'are', 'i', 'it', 'my', 'how', 'do', 'can', 'you', 'with', 'what', 'where', 'when', 'why'];
        
        // Only keep significant words
        const queryWords = normalizedQuery.split(/\W+/).filter(w => w && !stopWords.includes(w) && w.length > 1);
        const questionWords = normalizedQuestion.split(/\W+/).filter(w => w && !stopWords.includes(w) && w.length > 1);
        
        let matchCount = 0;
        for (const word of queryWords) {
          // Add extra weight for exact matches, partial for substring matches
          if (questionWords.some(qw => qw === word)) {
            matchCount += 1;
          } else if (questionWords.some(qw => qw.includes(word) || word.includes(qw))) {
            matchCount += 0.5;
          }
        }
        
        if (queryWords.length > 0) {
          // Adjust score to be percentage of significant words matched
          score = (matchCount / queryWords.length) * 100;
        }
      }

      // Require at least a 60% match threshold to avoid returning completely wrong answers
      console.log(`[DEBUG] Compared with Q:"${faq.question}" -> Score: ${score}%`);
      if (score > highestScore && score >= 60) { 
        highestScore = score;
        bestMatch = faq;
      }
    }

    if (bestMatch) {
      console.log(`[DEBUG] Best match found! Q:"${bestMatch.question}" with score ${highestScore}%`);
      return bestMatch.answer;
    }

    return null;

  } catch (error) {
    console.error('Error finding FAQ match:', error.message);
    // Do NOT crash or throw error. Return null safely.
    return null;
  }
};

module.exports = {
  findFAQMatch,
  findBestMatch: findFAQMatch // keep an alias for backward compatibility
};
