const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
require("dotenv").config();

/**
 * 📝 AI SERVICE - APRIL 2026 "LITE" VERSION
 * MODEL: gemini-2.5-flash-lite (Higher limits for Free Tier)
 * FIXED: 429 Quota issues by switching to Lite + Longer Cooldown
 * FIXED: History Role Order (Must start with User)
 */

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// 🛡️ Increased Cooldown to 5s to stay under the 20-request threshold
let lastCallTime = 0;
const COOLDOWN_MS = 5000;

class AIService {
  async generateResponse(message, history = []) {
    try {
      if (!genAI) return "API Key missing in .env";
      
      const now = Date.now();
      if (now - lastCallTime < COOLDOWN_MS) {
        return "I'm processing several requests. Please wait a few seconds.";
      }
      lastCallTime = now;

      // 🚀 1. SETUP MODEL (Switching to 'flash-lite' for better Free Tier availability)
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-lite", 
        systemInstruction: {
          role: "system",
          parts: [{ 
            text: "You are a Senior Support Specialist. Provide detailed, step-by-step solutions with bullet points. Be professional and comprehensive." 
          }]
        },
        generationConfig: {
          maxOutputTokens: 1200, // Slightly lower than full Flash to save quota
          temperature: 0.7,
          topP: 0.9,
        },
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        ],
      });

      // 🔄 2. FORMAT HISTORY (Role validation)
      let formattedHistory = history.map(msg => ({
        role: msg.sender === 'bot' ? 'model' : 'user',
        parts: [{ text: String(msg.text) }],
      }));

      // 🔥 FIX: Remove any bot messages from the start of the list
      while (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
        formattedHistory.shift(); 
      }

      // Limit context to save tokens/quota
      formattedHistory = formattedHistory.slice(-4);

      // 🧠 3. START CHAT
      const chat = model.startChat({ history: formattedHistory });
      
      console.log(`[AI] Calling Gemini 2.5 Flash-Lite for: ${message}`);

      const result = await chat.sendMessage(message);
      const response = await result.response;
      const reply = response.text().trim();

      return reply || "I couldn't generate a response. Please try a different question.";

    } catch (error) {
      console.error("AI Error:", error.message);

      // Handle Quota/Rate Limit Errors specifically
      if (error.message.includes('429')) {
        return "The daily free limit for this AI key is reached. Please try again in an hour or switch to Groq.";
      }
      if (error.message.includes('role')) {
        return "Internal Error: Chat history must start with a user message.";
      }
      
      return "Service currently unavailable. Please try again later.";
    }
  }

  async summarizeConversation(messages) {
    if (!messages || messages.length === 0) return "New Case";
    const userMsg = messages.find(m => m.sender !== 'bot')?.text || "";
    return userMsg.length > 25 ? userMsg.substring(0, 25) + "..." : "Support Chat";
  }
}

module.exports = new AIService();