const Profile = require('../models/Profile');
const { generateJSON } = require('../services/geminiService');

// ============================================================
// SYSTEM PROMPT — Intent Detection Engine
// ============================================================
const COPILOT_SYSTEM_PROMPT = `
You are "Resume Copilot", a smart AI assistant built into an AI-powered Resume Builder app.

Your job is to:
1. Understand the user's intent from their message
2. Perform the correct action
3. Always respond with ONLY valid JSON (no markdown, no code blocks, no extra text)

RESPONSE FORMAT (ALWAYS return this exact structure):
{
  "reply": "Your conversational response to the user",
  "action": "ONE of: NONE | UPDATE_PROFILE | GENERATE_SUMMARY | GENERATE_SKILLS | NAVIGATE | IMPROVE_RESUME | ATS_TIPS",
  "data": {}
}

ACTION RULES:

1. UPDATE_PROFILE — when user mentions personal info, skills, education, experience, phone, LinkedIn, etc.
   data format: { "field1": "value1", "technicalSkills": ["skill1", "skill2"], ... }
   Extractable fields: fullName, phone, location, currentRole, experienceLevel, technicalSkills (array),
   softSkills (array), linkedIn, github, portfolio, careerObjective, highestQualification, institution

2. GENERATE_SUMMARY — when user asks to generate/write/create a professional summary or about section
   data format: { "careerObjective": "the generated 3-sentence professional summary" }

3. GENERATE_SKILLS — when user asks to suggest/recommend skills for a role
   data format: { "role": "the job role", "skills": ["skill1", "skill2", "skill3", "skill4", "skill5"] }

4. NAVIGATE — when user asks to go somewhere / open a page
   data format: { "route": "/dashboard | /profile | /builder | /templates | /ai-tools | /resumes" }
   Route mapping: dashboard→/dashboard, profile/settings→/profile, builder/resume→/builder,
   templates→/templates, ai tools→/ai-tools, my resumes/resume list→/resumes

5. IMPROVE_RESUME — when user wants to improve, rewrite, or enhance their resume content
   data format: { "tips": ["tip1", "tip2", "tip3"] }

6. ATS_TIPS — when user asks about ATS, ATS score, making resume ATS-friendly
   data format: { "tips": ["tip1", "tip2", "tip3"], "score_estimate": "number/100" }

7. NONE — for general questions, greetings, or anything that doesn't require an action

Be warm, professional, and encouraging. Keep replies concise (max 2-3 sentences).
Never say you cannot do something — always help.
`;

// ============================================================
// CHAT ENDPOINT  POST /api/ai/chat
// ============================================================
const chatWithCopilot = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    console.log(`\n[Copilot] User: "${message}"`);

    // Build prompt with user message and system instructions
    const prompt = `${COPILOT_SYSTEM_PROMPT}

User message: "${message.trim()}"

Respond ONLY with valid JSON matching the format above.`;

    const result = await generateJSON(prompt);
    const parsed = result.json;

    // Validate response structure
    if (!parsed.reply || !parsed.action) {
      throw new Error('AI response missing required fields');
    }

    console.log(`[Copilot] Action: ${parsed.action} | Reply: ${parsed.reply.substring(0, 60)}...`);

    // ── PROFILE AUTO-UPDATE ────────────────────────────────────────────────
    if (parsed.action === 'UPDATE_PROFILE' && parsed.data && req.user?._id) {
      try {
        const updatePayload = { ...parsed.data };

        // Ensure technicalSkills and softSkills are always arrays
        if (updatePayload.technicalSkills && !Array.isArray(updatePayload.technicalSkills)) {
          updatePayload.technicalSkills = [updatePayload.technicalSkills];
        }
        if (updatePayload.softSkills && !Array.isArray(updatePayload.softSkills)) {
          updatePayload.softSkills = [updatePayload.softSkills];
        }

        await Profile.findOneAndUpdate(
          { userId: req.user._id },
          { $set: updatePayload },
          { upsert: true, new: true }
        );
        console.log(`[Copilot] Profile updated for user: ${req.user._id}`);
      } catch (dbErr) {
        console.warn('[Copilot] Profile update failed (non-fatal):', dbErr.message);
      }
    }

    res.status(200).json({
      success: true,
      reply:   parsed.reply,
      action:  parsed.action,
      data:    parsed.data || {},
    });

  } catch (error) {
    console.error('[Copilot Error]', error.message);

    const is429 = error.message?.includes('429') || error.message?.includes('quota');
    const statusCode = is429 ? 429 : 500;

    res.status(statusCode).json({
      success: false,
      reply: is429
        ? "I'm a bit overloaded right now! Please wait a moment and try again."
        : "I encountered an issue processing your request. Please try again.",
      action: 'NONE',
      data: {},
    });
  }
};

// ============================================================
// FILL PROFILE FROM FREEFORM TEXT  POST /api/ai/fill-profile
// ============================================================
const fillProfileFromText = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, message: 'text is required.' });

    const prompt = `
Extract all resume/profile information from this text and return it as a JSON object.

Text: "${text}"

Return ONLY this JSON (no extra text):
{
  "fullName": "or null",
  "phone": "or null",
  "location": "or null",
  "currentRole": "or null",
  "experienceLevel": "Entry | Mid | Senior | null",
  "technicalSkills": ["array of extracted technical skills or empty array"],
  "softSkills": ["array of extracted soft skills or empty array"],
  "careerObjective": "or null",
  "highestQualification": "or null",
  "institution": "or null",
  "linkedIn": "or null",
  "github": "or null"
}`;

    const result = await generateJSON(prompt);
    const extracted = result.json;

    // Remove null fields
    const cleanData = Object.fromEntries(
      Object.entries(extracted).filter(([, v]) => v !== null && v !== '' &&
        !(Array.isArray(v) && v.length === 0))
    );

    if (Object.keys(cleanData).length > 0 && req.user?._id) {
      await Profile.findOneAndUpdate(
        { userId: req.user._id },
        { $set: cleanData },
        { upsert: true, new: true }
      );
    }

    res.status(200).json({ success: true, extracted: cleanData, message: 'Profile updated from text.' });
  } catch (error) {
    console.error('[Fill Profile Error]', error.message);
    res.status(500).json({ success: false, message: 'Failed to extract profile data.' });
  }
};

// ============================================================
// GENERATE SUMMARY  POST /api/ai/generate-summary (Copilot)
// ============================================================
const copilotGenerateSummary = async (req, res) => {
  try {
    const { role, skills, experience } = req.body;

    const prompt = `
Write a 3-sentence professional resume summary for a ${role || 'professional'}.
Skills: ${Array.isArray(skills) ? skills.join(', ') : (skills || 'various skills')}
Experience: ${experience || 'relevant work experience'}

Return ONLY this JSON:
{ "summary": "the 3-sentence professional summary here" }`;

    const result = await generateJSON(prompt);
    const summary = result.json.summary;

    // Optionally save to profile
    if (summary && req.user?._id) {
      await Profile.findOneAndUpdate(
        { userId: req.user._id },
        { $set: { careerObjective: summary } },
        { upsert: true }
      );
    }

    res.status(200).json({ success: true, summary });
  } catch (error) {
    console.error('[Copilot Summary Error]', error.message);
    res.status(500).json({ success: false, message: 'Failed to generate summary.' });
  }
};

// ============================================================
// IMPROVE RESUME  POST /api/ai/improve-resume
// ============================================================
const improveResume = async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;
    if (!resumeData) return res.status(400).json({ success: false, message: 'resumeData is required.' });

    const prompt = `
You are an expert resume writer. Analyze this resume data and ${
  jobDescription ? `compare it against this job description: "${jobDescription}".` : 'suggest improvements.'
}

Resume: ${JSON.stringify(resumeData)}

Return ONLY this JSON:
{
  "overallScore": 75,
  "improvements": ["improvement 1", "improvement 2", "improvement 3", "improvement 4", "improvement 5"],
  "missingKeywords": ["keyword1", "keyword2"],
  "strengths": ["strength1", "strength2"],
  "rewrittenSummary": "improved summary if applicable or null"
}`;

    const result = await generateJSON(prompt);
    res.status(200).json({ success: true, ...result.json });
  } catch (error) {
    console.error('[Improve Resume Error]', error.message);
    res.status(500).json({ success: false, message: 'Failed to improve resume.' });
  }
};

module.exports = {
  chatWithCopilot,
  fillProfileFromText,
  copilotGenerateSummary,
  improveResume,
};
