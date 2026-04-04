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
        systemInstruction: {
          role: "system",
          parts: [{ 
            text: "You are a Senior Support Specialist. Provide detailed, step-by-step solutions with bullet points. Be professional and comprehensive." 
          }]
        },
        generationConfig: {
          maxOutputTokens: 1200,
          temperature: 0.7,
        },
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
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
      const chat = model.startChat({ history: formattedHistory || [] });
      
      let finalPrompt = message;
      if (fileContext) {
        finalPrompt = `[User attached: ${fileContext.fileName}]. ${message}`;
      }

      const enhancedPrompt = `${finalPrompt}\n\n[ANALYSIS FORMAT: <ANALYSIS> Sentiment: ... | Intent: ... | Action: ... </ANALYSIS>]`;

      console.log(`[AI-TRANSCEIVER] Transmitting to Gemini 1.5...`);
      
      const result = await chat.sendMessage(enhancedPrompt);
      const response = await result.response;
      
      if (!response || !response.text) {
        throw new Error("AI returned an empty or invalid response object.");
      }

      const rawText = response.text().trim();

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
      console.error("🔥 [AI-CRITICAL-ERROR]:", error);
      
      let errReply = "My intelligence circuits are experiencing a throughput delay. Please try again in 30 seconds.";
      if (error.message.includes('429')) errReply = "API Overloaded. Switching to backup nodes... please wait.";
      if (error.message.includes('key')) errReply = "Configuration error: System API Key invalid/missing.";
      
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