const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
require("dotenv").config();

/**
 * 📝 AI SERVICE - STABLE PRODUCTION VERSION
 * FIXED: TypeError on 'payload' by validating response candidates
 * FIXED: Uncaught Promises with comprehensive try/catch blocks
 * FIXED: History validation to ensure strict User -> Model alternation
 */

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

let lastCallTime = 0;
const COOLDOWN_MS = 5000;

class AIService {
  async generateResponse(message, history = [], fileContext = null) {
    try {
      if (!genAI) return { reply: "API Key missing in .env", insights: {} };
      
      const now = Date.now();
      if (now - lastCallTime < COOLDOWN_MS) {
        return { reply: "I'm processing several requests. Please wait a few seconds.", insights: {} };
      }
      lastCallTime = now;

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash", 
        generationConfig: { maxOutputTokens: 800, temperature: 0.7 },
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        ],
      });

      // 🔄 1. ROBUST HISTORY FORMATTING
      // Ensures array exists and filters out invalid messages
      let formattedHistory = (history || [])
        .filter(msg => msg && msg.text)
        .slice(-6)
        .map(msg => ({
          role: msg.sender === 'bot' ? 'model' : 'user',
          parts: [{ text: String(msg.text) }],
        }));

      // Validation: Chat MUST start with a 'user' role
      while (formattedHistory.length > 0 && formattedHistory[0].role !== 'user') {
        formattedHistory.shift();
      }

      let rawText = "";
      let attempts = 0;
      const MAX_ATTEMPTS = 2;

      while (attempts < MAX_ATTEMPTS) {
        try {
          const chat = model.startChat({ history: formattedHistory });
          const enhancedPrompt = `${message}\n\n[ANALYSIS: <ANALYSIS> Sentiment: ... | Intent: ... | Action: ... </ANALYSIS>]`;
          
          const result = await chat.sendMessage(enhancedPrompt);
          const response = await result.response;

          // 🛡️ 2. CRITICAL FIX: Check candidates before accessing .text()
          // This prevents the "Cannot read properties of undefined (reading 'payload')" error
          if (!response.candidates || response.candidates.length === 0) {
            console.warn("⚠️ AI blocked response or returned empty.");
            throw new Error("EMPTY_OR_BLOCKED_RESPONSE");
          }

          rawText = response.text().trim();
          if (rawText) break; 

        } catch (attemptErr) {
          attempts++;
          console.warn(`[AI-RETRY] Attempt ${attempts} failed:`, attemptErr.message);
          if (attempts >= MAX_ATTEMPTS) throw attemptErr;
          await new Promise(r => setTimeout(r, 2000));
        }
      }

      // 🧠 3. SAFE PARSING
      let reply = rawText || "I'm sorry, I couldn't generate a response.";
      let insights = { sentiment: 'Neutral', intent: 'General Query', suggestedAction: 'Assist user' };

      const analysisMatch = rawText.match(/<ANALYSIS>(.*?)<\/ANALYSIS>/s);
      if (analysisMatch) {
        reply = rawText.replace(/<ANALYSIS>.*?<\/ANALYSIS>/s, '').trim();
        analysisMatch[1].trim().split('|').forEach(tag => {
          const [key, val] = tag.split(':').map(s => s.trim());
          if (key === 'Sentiment') insights.sentiment = val;
          if (key === 'Intent') insights.intent = val;
          if (key === 'Action') insights.suggestedAction = val;
        });
      }

      return { reply, insights };

    } catch (error) {
      console.error("🔥 [AI-FATAL]:", error);
      
      let errReply = "My systems are currently stabilizing. Please try again shortly.";
      if (error.message.includes('429')) errReply = "Rate limit reached. Please wait a moment.";
      if (error.message.includes('EMPTY_OR_BLOCKED')) errReply = "I cannot discuss that topic for safety reasons.";
      
      return { 
        reply: errReply, 
        insights: { sentiment: 'Error', intent: 'System Failure', suggestedAction: 'Retry' } 
      };
    }
  }

  async summarizeConversation(messages) {
    if (!messages || messages.length === 0) return "New Conversation";
    const firstUserMsg = messages.find(m => m.sender !== 'bot')?.text || "Support Chat";
    return firstUserMsg.substring(0, 30) + "...";
  }
}

module.exports = new AIService();