const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// 1. Initialize Gemini
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// 2. Cooldown system for Free Tier stability
let lastCallTime = 0;
const COOLDOWN_MS = 3000;

class AIService {
  async generateResponse(message, history = []) {
    try {
      // 🛡️ API Key Check
      if (!genAI) {
        console.error("CRITICAL: GEMINI_API_KEY missing");
        return "AI configuration error. Please check .env file.";
      }

      // 🛡️ Input Validation
      if (!message || message.trim().length < 2) {
        return "How can I help you today?";
      }

      // 🛡️ Rate Limit / Cooldown
      const now = Date.now();
      if (now - lastCallTime < COOLDOWN_MS) {
        return "I'm thinking! Please give me a second.";
      }
      lastCallTime = now;

      // 🚀 Configure Model (Updated for April 2026)
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        // FIX: systemInstruction MUST be an object with a 'parts' array
        systemInstruction: {
          role: "system",
          parts: [{ text: "You are an empathetic customer support AI. Be concise (max 3 lines). No fluff." }]
        },
        generationConfig: {
          maxOutputTokens: 150,
          temperature: 0.6,
        },
      });

      // 🔄 Format History for the SDK
      // Roles must be exactly 'user' or 'model' (not 'bot' or 'assistant')
      const formattedHistory = history.slice(-4).map(msg => ({
        role: msg.sender === 'bot' ? 'model' : 'user',
        parts: [{ text: String(msg.text) }],
      }));

      // 🧠 Start Chat Session
      const chat = model.startChat({
        history: formattedHistory,
      });

      console.log(`[AI Service] Calling gemini-2.5-flash for: "${message}"`);

      // 📤 Send and Receive
      const result = await chat.sendMessage(message);
      const response = await result.response;
      const reply = response.text().trim();

      if (!reply) throw new Error("Empty response from AI");

      return reply;

    } catch (error) {
      console.error("AI Service Error:", error.message);

      // 🚩 Handle specific API errors
      if (error.message.includes('400')) {
        return "I had trouble understanding that format. Let's try again.";
      }
      if (error.message.includes('429')) {
        return "Rate limit reached. Please wait 60 seconds.";
      }
      if (error.message.includes('404')) {
        return "Model endpoint not found. Please verify the Gemini model ID.";
      }

      return "I'm having a quick connection issue. Can you repeat that?";
    }
  }

  async summarizeConversation(messages) {
    if (!messages || messages.length === 0) return "New Support Ticket";
    // Get the first user message text
    const firstMsg = messages.find(m => m.sender !== 'bot')?.text || "";
    return firstMsg.length > 25 ? firstMsg.substring(0, 25) + "..." : "Support Chat";
  }
}

module.exports = new AIService();