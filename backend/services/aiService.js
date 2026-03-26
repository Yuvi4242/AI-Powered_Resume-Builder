const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Configure the model (Gemini 1.5 Flash for speed and efficiency)
 */
const model = genAI.getGenerativeModel({ 
  model: 'gemini-2.0-flash',
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ],
});

/**
 * Common function to call Gemini SDK
 */
const callGeminiSDK = async (prompt) => {
  try {
    console.log("Gemini SDK: Generating content...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    if (error.message?.includes('429') || error.message?.includes('limit')) {
      console.error("Gemini Rate Limit Hit (Free Tier). Using Fallback.");
      throw new Error("RATE_LIMIT_EXCEEDED");
    }
    console.error("Gemini SDK Error:", error.message);
    throw error;
  }
};

/**
 * Generate a professional resume summary
 */
const generateSummary = async (data) => {
  const { currentRole, technicalSkills, experienceLevel } = data;
  
  const prompt = `
    Act as a professional career coach. Write a 3-line impactful resume summary for a ${currentRole || 'Professional'}.
    
    Context:
    - Skills: ${technicalSkills?.join(', ') || 'Various technical skills'}
    - Experience Level: ${experienceLevel || 'Professional'}
    
    Requirements:
    - Exactly 3 lines (impactful sentences).
    - Focus on achievements and value proposition.
    - Professional and modern tone.
    - No other text, just the summary.
  `;

  try {
    return await callGeminiSDK(prompt);
  } catch (error) {
    return `Results-driven ${currentRole || 'professional'} with expertise in ${technicalSkills?.slice(0, 3).join(', ') || 'modern technologies'}. Proven track record of delivering high-quality solutions and driving project success. Committed to continuous learning and professional excellence.`;
  }
};

/**
 * Suggest relevant skills for a job role
 */
const suggestSkills = async (role) => {
  const prompt = `
    Act as an HR Manager. Suggest 10 highly relevant technical skills for a ${role} position.
    Return ONLY a comma-separated list. No numbering or extra text.
  `;

  try {
    const resText = await callGeminiSDK(prompt);
    return resText.split(',').map(s => s.trim()).filter(s => s);
  } catch (error) {
    return ["JavaScript", "React", "Node.js", "Problem Solving", "Teamwork"];
  }
};

/**
 * Antigravity Logic: Optimize and reorder resume content based on JD
 */
const optimizeResumeContent = async (data, jobDescription) => {
  const prompt = `
    ANTIGRAVITY OPTIMIZATION TASK:
    Review these resume details: ${JSON.stringify(data)}.
    Now, compare them to this Job Description (JD): ${jobDescription}.
    
    TASKS:
    1. Reorder the bullet points to highlight the most relevant achievements first for this JD.
    2. Slightly rephrase key points to align better with JD keywords.
    3. Ensure the summary is tailored to this specific role.

    Return ONLY the optimized JSON structure matching the input fields (summary, experiences, skills).
  `;

  try {
    const resText = await callGeminiSDK(prompt);
    // Extract JSON from response
    const jsonMatch = resText.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Optimization failed, returning original data.");
    return data;
  }
};

module.exports = {
  generateSummary,
  suggestSkills,
  optimizeResumeContent,
  generateATSScore: async (text) => ({ score: 85, suggestions: ["Add metrics", "Check keywords"] }), // Mocking for now
  generateBulletPoints: async (title) => ["Built scalable apps", "Led teams"] // Mocking for now
};
