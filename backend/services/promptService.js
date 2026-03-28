/**
 * Centralized Prompt Service for AI Resume Builder
 * Functional prompt templates to ensure consistent, high-quality AI output.
 */

const ROLE_PROMPT = `You are an expert resume writer and career coach specializing in ATS-friendly resumes for the software industry and modern corporate roles.`;

const FORMAT_RULES = `
OUTPUT RULES:
- Return ONLY the final requested content.
- Do NOT include markdown backticks (e.g., \`\`\`json or \`\`\`text).
- Do NOT include conversational filler, intros, or summaries.
- Do NOT use quotes around the output.
- Use professional, action-oriented language.
- Ensure the output is ATS-friendly.
`;

/**
 * Summary Prompts
 */
const summaryPrompt = ({ name, role, skills, experience, projects, type = 'generate' }) => {
  const context = `
Name: ${name || 'N/A'}
Target Role: ${role || 'Software professional'}
Skills: ${Array.isArray(skills) ? skills.join(', ') : (skills || 'N/A')}
Experience Level: ${experience || 'N/A'}
Key Projects: ${Array.isArray(projects) ? projects.join(', ') : (projects || 'N/A')}
  `.trim();

  let instruction = "";
  if (type === 'improve') {
    instruction = "Improve the existing summary to be more impactful and professional.";
  } else if (type === 'shorten') {
    instruction = "Shorten the summary while maintaining its core impact and keywords.";
  } else if (type === 'ats') {
    instruction = "Optimize the summary for ATS systems, ensuring high keyword relevance.";
  } else {
    instruction = "Generate a compelling 3-4 sentence professional summary based on the context.";
  }

  return `
${ROLE_PROMPT}

CONTEXT:
${context}

TASK:
${instruction}

${FORMAT_RULES}
`.trim();
};

/**
 * Experience Prompts
 */
const experiencePrompt = ({ jobTitle, company, duration, rawText, technologies, type = 'generate' }) => {
  const context = `
Job Title: ${jobTitle || 'N/A'}
Company: ${company || 'N/A'}
Duration: ${duration || 'N/A'}
Technologies: ${Array.isArray(technologies) ? technologies.join(', ') : (technologies || 'N/A')}
Raw Input: ${rawText || 'N/A'}
  `.trim();

  let instruction = "";
  if (type === 'improve') {
    instruction = "Improve these experience bullet points with better action verbs and quantifiable results.";
  } else if (type === 'ats') {
    instruction = "Tailor these experience bullets for ATS systems by emphasizing relevant technical keywords.";
  } else if (type === 'verbs') {
    instruction = "Rewrite these bullets using strong resume action verbs (e.g., Spearheaded, Orchestrated, Optimized).";
  } else {
    instruction = "Generate 4-6 strong, action-oriented resume bullet points for this role.";
  }

  return `
${ROLE_PROMPT}

CONTEXT:
${context}

TASK:
${instruction}

${FORMAT_RULES}
- Return as a list of bullet points, each starting with "- ".
`.trim();
};

/**
 * Project Prompts
 */
const projectPrompt = ({ title, type: projectType, technologies, features, rawDescription, mode = 'generate' }) => {
  const context = `
Project Title: ${title || 'N/A'}
Project Type: ${projectType || 'N/A'}
Technologies: ${Array.isArray(technologies) ? technologies.join(', ') : (technologies || 'N/A')}
Key Features: ${features || 'N/A'}
Raw Description: ${rawDescription || 'N/A'}
  `.trim();

  let instruction = "";
  if (mode === 'improve') {
    instruction = "Improve this project description to sound more professional and technical.";
  } else if (mode === 'impact') {
    instruction = "Rewrite the description to highlight the technical impact and complexity.";
  } else {
    instruction = "Generate a professional 3-4 bullet point description for this project.";
  }

  return `
${ROLE_PROMPT}

CONTEXT:
${context}

TASK:
${instruction}

${FORMAT_RULES}
- Return as a list of bullet points, each starting with "- ".
`.trim();
};

/**
 * Skills Prompts
 */
const skillsPrompt = ({ role, currentSkills, projects, type = 'suggest' }) => {
  const context = `
Target Role: ${role || 'N/A'}
Current Skills: ${Array.isArray(currentSkills) ? currentSkills.join(', ') : (currentSkills || 'N/A')}
Projects: ${Array.isArray(projects) ? projects.join(', ') : (projects || 'N/A')}
  `.trim();

  let instruction = "";
  if (type === 'missing') {
    instruction = "Identify 10-15 missing technical skills for this role given the current context.";
  } else if (type === 'categorize') {
    instruction = "Categorize the skills into: Programming Languages, Frameworks/Libraries, Tools/Platforms, Databases, Concepts.";
  } else {
    instruction = "Suggest 15 relevant technical skills for this role.";
  }

  return `
${ROLE_PROMPT}

CONTEXT:
${context}

TASK:
${instruction}

${FORMAT_RULES}
- If categorizing, use the format "Category: Skill1, Skill2...".
- Otherwise, return a comma-separated list.
`.trim();
};

/**
 * General Text Prompts
 */
const textToolPrompt = ({ text, type = 'professional' }) => {
  let instruction = "";
  switch (type) {
    case 'grammar': instruction = "Fix the grammar and spelling while maintaining the professional tone."; break;
    case 'shorten': instruction = "Make this text more concise without losing key information."; break;
    case 'expand':  instruction = "Expand this text to be more detailed and professional."; break;
    case 'impact':  instruction = "Rewrite this text for better resume impact using strong wording."; break;
    default:        instruction = "Rewrite this text to be more professional and resume-ready.";
  }

  return `
${ROLE_PROMPT}

INPUT TEXT:
"${text}"

TASK:
${instruction}

${FORMAT_RULES}
`.trim();
};

/**
 * Job Description Optimization Prompt
 */
const optimizePrompt = ({ resumeData, jobDescription }) => {
  return `
${ROLE_PROMPT}

CURRENT RESUME DATA:
${JSON.stringify(resumeData)}

TARGET JOB DESCRIPTION:
${jobDescription}

TASK:
Optimize the resume summary, relevant skills, and specific bullet points to match this job description.
Identify high-frequency technical keywords from the JD and ensure they are naturally integrated.
Return ONLY the improved Summary and a list of suggested Keywords/Skills to add.

${FORMAT_RULES}
`.trim();
};

/**
 * ATS Analysis Prompt
 */
const atsAnalysisPrompt = ({ resumeData = {}, jobDescription = "" }) => {
  return `
${ROLE_PROMPT}
You are an advanced ATS (Applicant Tracking System) Analyzer. Perform an exhaustive audit of the provided resume data.

${jobDescription ? `Compare against this Job Description: ${jobDescription}` : 'Analyze professional quality and standard ATS formatting rules for a software professional.'}

RESUME DATA:
${JSON.stringify(resumeData)}

OUTPUT FORMAT (JSON ONLY):
{
  "score": 0-100,
  "breakdown": {
    "formatting": 0-25,
    "keywords": 0-25,
    "contentQuality": 0-25,
    "roleAlignment": 0-25
  },
  "strengths": ["list 3-5 major strengths"],
  "weaknesses": ["list 3-5 critical weaknesses"],
  "missingKeywords": ["list 5-10 specific technical strings found in JD but missing in resume"],
  "suggestions": [
    "Provide specific, actionable bullet points to improve the resume."
  ]
}

LANGUAGE RULE: Return values in professional English ONLY.
${FORMAT_RULES}
`.trim();
};

/**
 * Resume Review / Critique Prompt
 */
const resumeReviewPrompt = ({ resumeData }) => {
  return `
${ROLE_PROMPT}
Perform a comprehensive professional critique of this resume.

RESUME DATA:
${JSON.stringify(resumeData)}

TASK:
1. Identify missing sections.
2. Critique the impact of experience bullet points.
3. Check for technical skill depth.
4. Provide a "Checklist" of things to fix.

OUTPUT FORMAT (JSON ONLY):
{
  "checklist": ["item 1", "item 2"],
  "impactAnalysis": "Overall commentary on resume impact",
  "missingElements": ["section name", "contact info", etc.],
  "tips": ["actionable tips"]
}

${FORMAT_RULES}
`.trim();
};

/**
 * Job Optimization Prompt
 */
const roleOptimizePrompt = ({ resumeData, targetRole }) => {
  return `
${ROLE_PROMPT}
Optimize this resume for the specific target role: ${targetRole || 'Software Engineer'}.

RESUME DATA:
${JSON.stringify(resumeData)}

TASK:
1. Rewrite the summary to align with ${targetRole}.
2. Suggest 5 key technical skills to prioritize.
3. Provide 3 optimized experience bullets for this specific role.

OUTPUT FORMAT (JSON ONLY):
{
  "summary": "The rewritten summary",
  "skills": ["skill1", "skill2"],
  "bullets": ["bullet1", "bullet2"]
}

${FORMAT_RULES}
`.trim();
};

/**
 * Improvement Prompts
 */
const improvementPrompt = ({ section, content, context, userInstruction = "" }) => {
  return `
${ROLE_PROMPT}

ORIGINAL ${section.toUpperCase()}:
"${content}"

CONTEXT:
${JSON.stringify(context)}

INSTRUCTION: ${userInstruction || "Improve this content for better professional impact and ATS relevance."}

TASK:
Rewrite the content to be more powerful, using action verbs and technical keywords.
Ensure it is professional American English.

${FORMAT_RULES}
`.trim();
};

/**
 * Copilot / Chat Prompts (Unified Action Engine)
 */
const copilotPrompt = ({ message, history, resumeData }) => {
  return `
${ROLE_PROMPT}
You are "Resume Copilot", a task-based AI assistant.

CORE DIALECT:
- Conversational Reply: Use Hinglish (Hindi + English) or Hindi.
- Task Result (suggestedContent): Professional English.

ACTIONS:
- GENERATE_SUMMARY, IMPROVE_SUMMARY, REWRITE_PROJECT, SUGGEST_SKILLS, ATS_ANALYZE, ATS_RESCAN, RESUME_REVIEW, NAVIGATE.

CURRENT RESUME STATE:
${JSON.stringify(resumeData)}

CHAT HISTORY:
${Array.isArray(history) ? history.map(h => `${h.role}: ${h.content}`).join('\n') : 'No history.'}

USER MESSAGE:
"${message}"

TASK:
- If a task is requested (e.g. "summary likh de"), perform it.
- Return EXACTLY this JSON structure:
{
  "reply": "Friendly confirmation in Hinglish",
  "action": "ACTION_NAME",
  "suggestedContent": "The actual resume text generated",
  "data": { "tips": [], "score": 0, "missingKeywords": [] }
}

${FORMAT_RULES}
`.trim();
};

module.exports = {
  summaryPrompt,
  experiencePrompt,
  projectPrompt,
  skillsPrompt,
  textToolPrompt,
  optimizePrompt,
  atsAnalysisPrompt,
  resumeReviewPrompt,
  roleOptimizePrompt,
  improvementPrompt,
  copilotPrompt
};
