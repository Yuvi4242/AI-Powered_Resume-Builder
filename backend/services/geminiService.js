const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

// ============================================================
// CONSTANTS
// ============================================================
const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT,        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,       threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

const GENERATION_CONFIG = {
  temperature:     0.75,
  topP:            0.95,
  topK:            40,
  maxOutputTokens: 2048,
};

// Full ordered fallback chain — tried in order if primary fails
// These are all current models available in 2026 on the free tier
const FALLBACK_CHAIN = [
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash-8b',
  'gemini-1.5-flash',
  'gemini-1.0-pro',
];

// ============================================================
// ERROR CLASSIFICATION
// ============================================================
const classifyError = (error) => {
  const msg = (error?.message || '').toLowerCase();

  if (!process.env.GEMINI_API_KEY)                                   return 'MISSING_KEY';
  if (msg.includes('api key not valid') || msg.includes('api_key_invalid')) return 'INVALID_KEY';
  if (msg.includes('429') || msg.includes('quota') || msg.includes('rate limit') || msg.includes('resource_exhausted')) return 'RATE_LIMIT';
  // 404 model not found — do NOT retry, try next model instead
  if (msg.includes('404') || msg.includes('not found for api version') || msg.includes('not supported for generatecontent')) return 'MODEL_NOT_FOUND';
  // 400 can be model-related (bad model name) or content safety — handle both
  if (msg.includes('400') && (msg.includes('not found') || msg.includes('invalid'))) return 'MODEL_NOT_FOUND';
  if (msg.includes('400'))                                           return 'INVALID_REQUEST';
  if (msg.includes('500') || msg.includes('503') || msg.includes('502') || msg.includes('internal')) return 'SERVER_ERROR';
  if (msg.includes('econnreset') || msg.includes('timeout') || msg.includes('etimedout') || msg.includes('network')) return 'NETWORK_ERROR';

  return 'UNKNOWN';
};

// ============================================================
// INTERNAL: CREATE A MODEL INSTANCE
// ============================================================
const _createModel = (modelName, systemInstruction = null) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is missing from environment variables.');

  const genAI = new GoogleGenerativeAI(apiKey);
  const opts = {
    model: modelName,
    safetySettings: SAFETY_SETTINGS,
    generationConfig: GENERATION_CONFIG,
  };
  if (systemInstruction) opts.systemInstruction = systemInstruction;

  return genAI.getGenerativeModel(opts);
};

// ============================================================
// INTERNAL: SINGLE ATTEMPT WITH BACKOFF FOR RETRYABLE ERRORS
// ============================================================
const _callWithBackoff = async (model, prompt, maxRetries = 3) => {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`  ↳ Attempt ${attempt}/${maxRetries}...`);
      const result   = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      lastError = error;
      const type = classifyError(error);

      if (type === 'MISSING_KEY' || type === 'INVALID_KEY') {
        console.error(`  ✗ Fatal key error (${type}). Aborting.`);
        throw error;
      }

      if (type === 'MODEL_NOT_FOUND') {
        console.warn(`  ✗ Model not available (404). Will try fallback model.`);
        const err = new Error(error.message);
        err.geminiErrorType = 'MODEL_NOT_FOUND';
        throw err;
      }

      if (type === 'INVALID_REQUEST') {
        console.error(`  ✗ Invalid request (400). Check your prompt or parameters.`);
        throw error;
      }

      if (attempt < maxRetries) {
        // 429 rate limit needs a real wait — the free tier resets per minute
        const delay = type === 'RATE_LIMIT'
          ? 30000 * attempt  // 30s, 60s, 90s
          : 1000  * attempt  // 1s, 2s for transient errors
        console.warn(`  ⚠️  ${type} on attempt ${attempt}/${maxRetries}. Waiting ${delay / 1000}s before retry...`);
        await new Promise(r => setTimeout(r, delay));
      } else {
        console.warn(`  ✗ ${type}: Exhausted all ${maxRetries} retries.`);
      }
    }
  }

  throw lastError;
};

// ============================================================
// PUBLIC: SAFE GENERATE — Tries primary model with backoff,
// only switches to fallback on MODEL_NOT_FOUND (404), NOT on 429.
// ============================================================
const safeGenerate = async (prompt, options = {}) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is missing from environment variables.');

  const primaryModel      = process.env.GEMINI_MODEL         || 'gemini-2.0-flash';
  const fallbackModel     = process.env.GEMINI_FALLBACK_MODEL || 'gemini-2.0-flash-lite';
  const maxRetries        = options.maxRetries ?? 3;
  const systemInstruction = options.systemInstruction || null;

  console.log(`\n🤖 Gemini AI Request — Model: ${primaryModel}`);

  // --- STEP 1: Try primary model with exponential backoff ---
  try {
    const model = _createModel(primaryModel, systemInstruction);
    const text  = await _callWithBackoff(model, prompt, maxRetries);
    console.log(`  ✅ Success on ${primaryModel}\n`);
    return { text, model: primaryModel, usedFallback: false };
  } catch (primaryError) {
    // Only switch to a different model on 404 MODEL_NOT_FOUND
    // On 429 rate limit, a different model still uses the same key — no point switching
    if (primaryError.geminiErrorType !== 'MODEL_NOT_FOUND') {
      throw primaryError; // propagate rate limit, key errors, etc.
    }
    console.warn(`  ↪ Primary model not found. Switching to fallback: ${fallbackModel}`);
  }

  // --- STEP 2: Try fallback model (only reached on 404) ---
  try {
    const model = _createModel(fallbackModel, systemInstruction);
    const text  = await _callWithBackoff(model, prompt, maxRetries);
    console.log(`  ✅ Success on fallback: ${fallbackModel}\n`);
    return { text, model: fallbackModel, usedFallback: true };
  } catch (fallbackError) {
    console.error(`  ✗ Fallback model also failed: ${fallbackError.message?.split('\n')[0]}`);
    throw new Error(`AI service unavailable. Both models failed. Last error: ${fallbackError.message?.split('\n')[0]}`);
  }
};

// ============================================================
// PUBLIC: GENERATE TEXT
// ============================================================
const generateText = async (prompt) => {
  const result = await safeGenerate(prompt);
  return result.text;
};

// ============================================================
// PUBLIC: GENERATE JSON
// ============================================================
const generateJSON = async (prompt) => {
  const jsonSystemInstruction = `
    You are a JSON generator.
    ONLY return valid JSON. No markdown, no backticks, no code fences, no explanatory text.
    If you cannot fulfill the request, return: {"error": "Cannot process request"}
  `;
  const jsonPrompt = `${prompt}\n\nCRITICAL: Return ONLY valid JSON. No other text.`;

  const result = await safeGenerate(jsonPrompt, { systemInstruction: jsonSystemInstruction });

  // Strip any accidental markdown fences
  let raw = result.text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();

  try {
    return { json: JSON.parse(raw), model: result.model, usedFallback: result.usedFallback };
  } catch {
    console.error('  ✗ AI returned invalid JSON. Raw response:', raw.substring(0, 200));
    throw new Error(`AI returned invalid JSON. Raw: ${raw.substring(0, 100)}`);
  }
};

// ============================================================
// PUBLIC: HEALTH CHECK
// ============================================================
const validateModel = async () => {
  const primary = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  console.log(`\n🔍 Health Check — Testing model chain (primary: ${primary})`);
  try {
    const result = await safeGenerate('Reply with the word OK and nothing else.');
    console.log(`  ✅ Active model: "${result.model}" | Fallback used: ${result.usedFallback}\n`);
    return { healthy: true, model: result.model, usedFallback: result.usedFallback };
  } catch (error) {
    console.error(`  ✗ Health check failed: ${error.message}`);
    return { healthy: false, error: error.message };
  }
};

// ============================================================
// RESUME COPILOT HELPERS
// ============================================================

const generateResumeSummary = async (data) => {
  const { role = 'Professional', skills = [], yearsOfExperience = '' } = data;
  const prompt = `
    Act as a professional career coach. Write a 3-sentence impactful resume summary.
    Role: ${role}
    Skills: ${Array.isArray(skills) ? skills.join(', ') : skills}
    Experience: ${yearsOfExperience}
    Return JSON: { "summary": "..." }
  `;
  const result = await generateJSON(prompt);
  return result.json.summary || '';
};

const improveProjectDescription = async (text) => {
  const prompt = `
    You are a professional resume writer. Rewrite these bullet points using strong action verbs and quantifiable metrics.
    Input: "${text}"
    Return JSON: { "improved": "..." }
  `;
  const result = await generateJSON(prompt);
  return result.json.improved || text;
};

const parseUserProfileInput = async (message) => {
  const prompt = `
    You are a resume assistant. Analyze this user message and extract structured information.
    Message: "${message}"
    Return JSON: {
      "intent": "update_skill | update_experience | generate_summary | unknown",
      "field": "field name or null",
      "value": "extracted value or null",
      "confidence": 0.0
    }
  `;
  const result = await generateJSON(prompt);
  return result.json;
};

const suggestSkillsForRole = async (role) => {
  const prompt = `
    You are an expert tech recruiter. List the 5 most in-demand technical skills for: ${role}
    Return JSON: { "skills": ["skill1", "skill2", "skill3", "skill4", "skill5"] }
  `;
  const result = await generateJSON(prompt);
  return result.json.skills || [];
};

const antigravityOptimize = async (bulletPoints, jobDescription) => {
  const prompt = `
    You are an expert recruiter. Perform "Antigravity" optimization.
    Reorder these bullet points so the most relevant to the Job Description appear first.
    Remove or deprioritize irrelevant points.
    Bullet Points: ${JSON.stringify(bulletPoints)}
    Job Description: ${jobDescription}
    Return JSON: { "optimizedPoints": ["point1", "point2"] }
  `;
  const result = await generateJSON(prompt);
  return result.json.optimizedPoints || bulletPoints;
};

// ============================================================
// EXPORTS
// ============================================================
module.exports = {
  safeGenerate,
  generateText,
  generateJSON,
  validateModel,
  generateResumeSummary,
  improveProjectDescription,
  parseUserProfileInput,
  suggestSkillsForRole,
  antigravityOptimize,
};
