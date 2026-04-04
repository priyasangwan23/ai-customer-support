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

      // 🚀 1. SETUP MODEL (Switching to 'flash-lite' for better Free Tier availability)
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash", 
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
      
      let finalPrompt = message;
      if (fileContext) {
        finalPrompt = `[User has attached a file: ${fileContext.fileName} (${fileContext.fileType}). URL: ${fileContext.url}]\n\nUser Question: ${message}`;
      }

      console.log(`[AI] Calling Gemini 1.5 Flash for: ${message}`);

      // 🔥 ENHANCED PROMPT: Ask for the reply AND analysis tags
      const enhancedPrompt = `${finalPrompt}\n\n[INSTRUCTION: After your reply, on a new line, provide analysis in this format: <ANALYSIS> Sentiment: (Positive|Neutral|Negative) | Intent: (Short Intent Category) | Action: (1-step suggested action) </ANALYSIS>]`;

      const result = await chat.sendMessage(enhancedPrompt);
      const response = await result.response;
      const rawText = response.text().trim();

      // Parse result
      let reply = rawText;
      let insights = { sentiment: 'Neutral', intent: 'General Query', suggestedAction: 'Assist user' };

      const analysisMatch = rawText.match(/<ANALYSIS>(.*?)<\/ANALYSIS>/s);
      if (analysisMatch) {
        reply = rawText.replace(/<ANALYSIS>.*?<\/ANALYSIS>/s, '').trim();
        const tags = analysisMatch[1].trim().split('|');
        tags.forEach(tag => {
          const [key, val] = tag.split(':').map(s => s.trim());
          if (key === 'Sentiment') insights.sentiment = val;
          if (key === 'Intent') insights.intent = val;
          if (key === 'Action') insights.suggestedAction = val;
        });
      }

      return { reply, insights };

    } catch (error) {
      console.error("AI Error:", error.message);
      let errReply = "Service currently unavailable.";
      if (error.message.includes('429')) errReply = "Free quota reached.";
      
      return { 
        reply: errReply, 
        insights: { sentiment: 'Neutral', intent: 'Error Handle', suggestedAction: 'Retry' } 
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