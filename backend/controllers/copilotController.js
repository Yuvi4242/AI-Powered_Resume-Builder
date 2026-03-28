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
 * SYSTEM PROMPT — Intent Detection Engine (Groq Optimized)
 */
const COPILOT_SYSTEM_PROMPT = `
You are "Resume Copilot", a smart AI assistant built into an AI-powered Resume Builder app.
Your job is to understand the user's intent and return a JSON response.

RESPONSE FORMAT:
{
  "reply": "Conversational response to user (max 2 sentences)",
  "action": "NONE | UPDATE_PROFILE | GENERATE_SUMMARY | GENERATE_SKILLS | NAVIGATE | IMPROVE_RESUME | ATS_TIPS",
  "data": {}
}

ACTION RULES:
1. UPDATE_PROFILE: Extract info (fullName, phone, location, currentRole, technicalSkills (array), linkedIn, github).
2. GENERATE_SUMMARY: Generate 3-sentence summary in data.careerObjective.
3. GENERATE_SKILLS: Suggest skills for a role.
4. NAVIGATE: route mapping (/dashboard, /profile, /builder, /templates, /ai-tools, /resumes).
5. IMPROVE_RESUME / ATS_TIPS: Provide tips array in data.tips.

Return ONLY valid JSON.
`.trim();

/**
 * CHAT ENDPOINT
 * POST /api/ai/chat
 */
const chatWithCopilot = async (req, res) => {
  try {
    const { message, resumeData, history } = req.body;

    if (!message) return fail(res, 400, 'Message is required.');

    const prompt = `${COPILOT_SYSTEM_PROMPT}\n\nUser message: "${message}"\n\nContext:\n${JSON.stringify(resumeData || {})}\n\nReturn JSON.`;

    // Use Groq JSON generation
    const result = await generateJSON(prompt);
    
    // ── PROFILE AUTO-UPDATE ────────────────────────────────────────────────
    if (result.action === 'UPDATE_PROFILE' && result.data && req.user?._id) {
      try {
        const updatePayload = { ...result.data };
        if (updatePayload.technicalSkills && !Array.isArray(updatePayload.technicalSkills)) {
          updatePayload.technicalSkills = [updatePayload.technicalSkills];
        }
        await Profile.findOneAndUpdate(
          { userId: req.user._id },
          { $set: updatePayload },
          { upsert: true }
        );
      } catch (e) {
        console.warn('[Copilot] Profile update failed:', e.message);
      }
    }

    return ok(res, {
      message: 'AI content generated successfully',
      data: {
        type: 'chat',
        text: result.reply || 'How can I assist you with your resume today?',
        action: result.action || 'NONE',
        payload: result.data || {},
        meta: { provider: 'groq', model: process.env.GROQ_MODEL }
      }
    });

  } catch (error) {
    console.error('[Copilot Error]:', error.message);
    return fail(res, 500, 'Copilot is currently unavailable.');
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
