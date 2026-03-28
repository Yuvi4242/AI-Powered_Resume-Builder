/**
 * groqService.js
 * Groq AI Service for AI Resume Builder.
 * DIRECT REST Implementation using axios (to bypass dependency issues).
 */

const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const DEFAULT_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

if (!GROQ_API_KEY) {
  console.warn('⚠️  GROQ_API_KEY is not set in .env. AI features will fail.');
}

/**
 * Common text generation for Groq using axios.
 * @param {string} prompt - The prompt to send.
 * @param {object} options - Generation options.
 */
const generateText = async (prompt, options = {}) => {
  try {
    const { model = DEFAULT_MODEL, temperature = 0.7, max_tokens = 1024 } = options;

    console.log(`[GroqService] Calling Groq REST API with model: ${model}`);
    
    const response = await axios.post(
      GROQ_API_URL,
      {
        messages: [
          {
            role: 'system',
            content: 'You are a professional resume writer and career coach. Your task is to provide concise, ATS-friendly, and professional resume content. Return only the requested content without preambles or explanations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model,
        temperature,
        max_tokens,
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices?.[0]?.message?.content || '';
    
    if (!content) {
      throw new Error('Groq returned an empty response.');
    }

    return content;
  } catch (error) {
    const errorMsg = error.response?.data?.error?.message || error.message;
    console.error('[GroqService Error]:', errorMsg);
    throw new Error(errorMsg);
  }
};

/**
 * Generate JSON structure from Groq with deep extraction logic.
 */
const generateJSON = async (prompt, options = {}) => {
  try {
    const jsonPrompt = `${prompt}\n\nIMPORTANT: Return valid JSON ONLY. No markdown fences. No preamble.`;
    
    let content = await generateText(jsonPrompt, {
      ...options,
      temperature: 0.1, 
    });

    // Cleanup: remove common AI prefixes if any
    content = content.trim();
    if (content.startsWith("```json")) content = content.replace(/^```json/, '').replace(/```$/, '');
    else if (content.startsWith("```")) content = content.replace(/^```/, '').replace(/```$/, '');

    try {
      // 1. Try direct parse
      return JSON.parse(content);
    } catch (e) {
      // 2. Try Regex Extraction (Targeting the last JSON block in case of preambles)
      const jsonRegex = /({[\s\S]*})|(\[[\s\S]*\])/g;
      let match;
      let lastMatch = null;
      while ((match = jsonRegex.exec(content)) !== null) {
        lastMatch = match[0];
      }

      if (lastMatch) {
        try {
          return JSON.parse(lastMatch);
        } catch (innerE) {
          console.warn('[GroqService] Regex JSON parse failed.');
        }
      }

      // 3. Last Resort: Structured Fallback
      console.warn('[GroqService] JSON parse failed, returning raw string in object.');
      return { 
        reply: content.slice(0, 150),
        status: "PARSING_ERROR",
        raw: content
      };
    }
  } catch (error) {
    console.error('[GroqService JSON Error]:', error.message);
    throw error;
  }
};

module.exports = {
  generateText,
  generateJSON,
};
