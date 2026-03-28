/**
 * copilotController.js
 * AI Copilot Controller - Re-implemented for Groq.
 * Handles interactive chat, profile auto-filling, and smart resume improvements.
 */

const Profile = require('../models/Profile');
const { generateJSON, generateText } = require('../services/groqService');
const prompts = require('../services/promptService');
const aiResponseParser = require('../utils/aiResponseParser');
const { ok, fail } = require('../utils/apiResponse');

/**
 * SYSTEM PROMPT — Intent Detection Engine (Action-Oriented)
 */
const COPILOT_SYSTEM_PROMPT = `
You are "Resume Copilot", a professional AI Resume Systems Engineer. 
Your goal is to perform actual resume building tasks, NOT just chat.

CORE DIALECT:
- Conversational Reply: Use Hinglish or Hindi.
- Task Result (suggestedContent): Professional English.

STRICT JSON RESPOND RULES:
1. "reply": Short confirmation in Hinglish (e.g. "Bilkul! Maine aapka summary generate kar diya hai.").
2. "action": One of: GENERATE_SUMMARY, IMPROVE_SUMMARY, REWRITE_PROJECT, IMPROVE_EXPERIENCE, SUGGEST_SKILLS, ATS_ANALYZE, NAVIGATE.
3. "suggestedContent": The ACTUAL RESUME TEXT (Summary, Project description, etc.).
4. "data": Structured info for cards.

FOR ATS TASKS:
If asked for ATS score, return "action": "ATS_ANALYZE" and populate "data" with { "score": 0-100, "missingKeywords": ["string"], "feedback": "Short critique" }.
`.trim();

/**
 * CHAT ENDPOINT
 * POST /api/ai/chat
 */
const chatWithCopilot = async (req, res) => {
  try {
    const { message, resumeData, history } = req.body;
    if (!message) return fail(res, 400, 'Message is required.');

    const prompt = `
${COPILOT_SYSTEM_PROMPT}

CURRENT RESUME CONTEXT:
${JSON.stringify(resumeData || {})}

CHAT HISTORY:
${Array.isArray(history) ? history.map(h => `${h.role}: ${h.content}`).join('\n') : 'No history.'}

USER MESSAGE:
"${message}"

Return JSON only.
    `.trim();

    const result = await generateJSON(prompt);
    
    // Ensure we have a meaningful reply or a clear intent to help
    const botReply = result.reply || (result.suggestedContent ? "Bilkul! Maine aapka request implement kar diya hai." : "Main aapki resume me kaise help kar sakta hoon?");

    return ok(res, {
      message: 'Assistant response processed',
      data: {
        type: 'chat',
        text: botReply,
        action: result.action || 'NONE',
        suggestedContent: result.suggestedContent || '',
        payload: result.data || {},
        meta: { provider: 'groq', model: process.env.GROQ_MODEL }
      }
    });

  } catch (error) {
    console.error('[Copilot Error]:', error.message);
    return fail(res, 500, 'Assistant ke backend me temporary issue hai. Krpaya try again.');
  }
};

/**
 * FILL PROFILE FROM TEXT
 * POST /api/ai/fill-profile
 */
const fillProfileFromText = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return fail(res, 400, 'Text is required.');

    const prompt = `Extract resume info from this text: "${text}"\n\nReturn JSON with fields: fullName, phone, location, currentRole, experienceLevel, technicalSkills (array), softSkills (array), careerObjective, highestQualification, institution, linkedIn, github.`;

    const extracted = await generateJSON(prompt);

    // Clean nulls
    const cleanData = Object.fromEntries(
      Object.entries(extracted).filter(([, v]) => v !== null && v !== '' && !(Array.isArray(v) && v.length === 0))
    );

    if (Object.keys(cleanData).length > 0 && req.user?._id) {
      await Profile.findOneAndUpdate(
        { userId: req.user._id },
        { $set: cleanData },
        { upsert: true }
      );
    }

    return ok(res, { extracted: cleanData, message: 'Profile updated from text.' });
  } catch (error) {
    return fail(res, 500, 'Failed to extract profile data.');
  }
};

/**
 * IMPROVE RESUME (Copilot)
 * POST /api/ai/improve-resume
 */
const improveResume = async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;
    
    const prompt = `Analyze this resume and provide improvements: ${JSON.stringify(resumeData)} ${jobDescription ? `against this JD: ${jobDescription}` : ''}\n\nReturn JSON: { "overallScore": 0-100, "improvements": [], "missingKeywords": [], "strengths": [] }`;

    const result = await generateJSON(prompt);
    return ok(res, result);
  } catch (error) {
    return fail(res, 500, 'Failed to analyze resume.');
  }
};

/**
 * GENERATE SUMMARY (Copilot)
 * POST /api/ai/generate-summary
 */
const copilotGenerateSummary = async (req, res) => {
  try {
    const { role, skills, experience } = req.body;
    const prompt = `Write a 3-sentence professional resume summary for a ${role || 'professional'}. Skills: ${Array.isArray(skills) ? skills.join(', ') : (skills || 'various')}. Experience: ${experience || 'relevant'}.`;
    
    const summary = await generateText(prompt);
    
    // Optionally save to profile
    if (summary && req.user?._id) {
      await Profile.findOneAndUpdate(
        { userId: req.user._id },
        { $set: { careerObjective: summary } },
        { upsert: true }
      );
    }

    return ok(res, { success: true, summary });
  } catch (error) {
    return fail(res, 500, 'Failed to generate summary.');
  }
};

module.exports = {
  chatWithCopilot,
  fillProfileFromText,
  improveResume,
  copilotGenerateSummary,
};
