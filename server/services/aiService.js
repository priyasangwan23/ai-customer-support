const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
require("dotenv").config();

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

class AIService {
  async generateResponse(message, history = []) {
    try {
      if (!genAI) return { reply: "AI Configuration Error.", insights: {} };

      // 🚀 FIX 1: Changed from "gemini-2.5-flash-lite" to "gemini-1.5-flash"
      // 1.5-flash allows 1,500 requests per day. 2.5-lite only allows 20.
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash", 
        generationConfig: { maxOutputTokens: 500, temperature: 0.7 },
      });

      // 🔄 FIX 2: Clean History (Gemini fails if history is messy)
      const formattedHistory = (history || [])
        .filter(msg => msg && msg.text && msg.sender)
        .slice(-4)
        .map(msg => ({
          role: msg.sender === 'bot' ? 'model' : 'user',
          parts: [{ text: String(msg.text) }],
        }));

      // Ensure history starts with user
      if (formattedHistory.length > 0 && formattedHistory[0].role !== 'user') {
        formattedHistory.shift();
      }

      // ⚡ Start Chat
      const chat = model.startChat({ history: formattedHistory });
      
      // We wrap this in a sub-try/catch to handle the "429 Quota" specifically
      try {
        const result = await chat.sendMessage(message);
        const response = await result.response;

        // 🛡️ FIX 3: Prevent "payload" undefined error
        if (!response.candidates || response.candidates.length === 0) {
          return { reply: "I'm sorry, I can't answer that right now.", insights: {} };
        }

        const reply = response.text();
        return { 
          reply: reply, 
          insights: { sentiment: 'Neutral', intent: 'General' } 
        };

      } catch (apiErr) {
        if (apiErr.message.includes('429')) {
          return { 
            reply: "Our AI is currently at daily capacity. Please try again tomorrow or contact support directly.", 
            insights: { intent: 'QUOTA_EXCEEDED' } 
          };
        }
        throw apiErr; // Pass other errors to the main catch
      }

    } catch (error) {
      console.error("🔥 AI CRITICAL ERROR:", error.message);
      return { 
        reply: "I'm having trouble thinking. Let's try again in a minute.", 
        insights: { error: true } 
      };
    }
  }
}

module.exports = new AIService();
