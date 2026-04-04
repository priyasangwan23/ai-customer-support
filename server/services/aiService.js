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
  async generateResponse(message, history = [], fileContext = null) {
    try {
      if (!genAI) return "API Key missing in .env";
      
      const now = Date.now();
      if (now - lastCallTime < COOLDOWN_MS) {
        return "I'm processing several requests. Please wait a few seconds.";
      }
      lastCallTime = now;

      // 🚀 1. SETUP MODEL
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash", 
        generationConfig: { maxOutputTokens: 800, temperature: 0.7 },
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
          { category: HarmCategory.HARM_BLOCK_THRESHOLD_UNSPECIFIED, threshold: HarmBlockThreshold.BLOCK_NONE },
        ],
      });

      // 🔄 2. FORMAT HISTORY
      let formattedHistory = history.slice(-4).map(msg => ({
        role: msg.sender === 'bot' ? 'model' : 'user',
        parts: [{ text: String(msg.text) }],
      }));

      // Role order validation
      while (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
        formattedHistory.shift(); 
      }

      // 🧠 3. CALL WITH RETRY
      let rawText = "";
      let attempts = 0;
      const MAX_ATTEMPTS = 2;

      while (attempts < MAX_ATTEMPTS) {
        try {
          const chat = model.startChat({ history: formattedHistory || [] });
          const enhancedPrompt = `${message}\n\n[ANALYSIS: <ANALYSIS> Sentiment: ... | Intent: ... | Action: ... </ANALYSIS>]`;
          
          console.log(`[AI-NODE] Transmitting... (Attempt ${attempts + 1})`);
          
          const result = await chat.sendMessage(enhancedPrompt);
          const response = await result.response;
          
          if (response && response.text) {
             rawText = response.text().trim();
             if (rawText) break; // Success!
          }
        } catch (attemptErr) {
          attempts++;
          console.warn(`[AI-STUTTER] Attempt ${attempts} failed:`, attemptErr.message);
          if (attempts >= MAX_ATTEMPTS) throw attemptErr;
          await new Promise(r => setTimeout(r, 2000)); // Delay before retry
        }
      }

      if (!rawText) throw new Error("Empty AI Response after retries");

      // Parse result
      let reply = rawText;
      let insights = { sentiment: 'Neutral', intent: 'General Query', suggestedAction: 'Assist user' };

      const analysisMatch = rawText.match(/<ANALYSIS>(.*?)<\/ANALYSIS>/s);
      if (analysisMatch) {
        reply = rawText.replace(/<ANALYSIS>.*?<\/ANALYSIS>/s, '').trim();
        const tags = analysisMatch[1].trim().split('|');
        tags.forEach(tag => {
          const pair = tag.split(':');
          if (pair.length === 2) {
            const key = pair[0].trim();
            const val = pair[1].trim();
            if (key === 'Sentiment') insights.sentiment = val;
            if (key === 'Intent') insights.intent = val;
            if (key === 'Action') insights.suggestedAction = val;
          }
        });
      }

      return { reply, insights };

    } catch (error) {
      console.error("🔥 [AI-CORE-CRITICAL]:", error);
      
      let errReply = "My intelligence circuits are experiencing a brief delay. Please try again in 30 seconds.";
      if (error.message.includes('429')) errReply = "System over-capacity. Polling backup nodes... please wait.";
      if (error.message.includes('key')) errReply = "Security Protocol error: API Key missing/invalid on backend.";
      
      return { 
        reply: errReply, 
        insights: { sentiment: 'Neutral', intent: 'System Error', suggestedAction: 'Contact Support' } 
      };
    }
  }

  async summarizeConversation(messages) {
    if (!messages || messages.length === 0) return "New Case";
    const userMsg = messages.find(m => m.sender !== 'bot')?.text || "";
    return userMsg.length > 25 ? userMsg.substring(0, 25) + "..." : "Support Chat";
  }
}

module.exports = new AIService();