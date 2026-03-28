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
 * Generate JSON structure from Groq.
 */
const generateJSON = async (prompt, options = {}) => {
  try {
    const jsonPrompt = `${prompt}\n\nIMPORTANT: Return valid JSON ONLY. No markdown fences. No preamble.`;
    
    const content = await generateText(jsonPrompt, {
      ...options,
      temperature: 0.2,
    });

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      const jsonStr = jsonMatch ? jsonMatch[0] : content;
      return JSON.parse(jsonStr);
    } catch (e) {
      console.warn('[GroqService] JSON parse failed, returning raw string in object.');
      return { content: content };
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
