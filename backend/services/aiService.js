const axios = require('axios');

/**
 * Common function to call Gemini API via axios
 */
const callGemini = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  // Explicitly using the stable 'v1' endpoint which supports gemini-1.5-flash
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  console.log(`Gemini Request: Calling v1 API with gemini-1.5-flash`);
  
  try {
    const response = await axios.post(url, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    }, {
      timeout: 10000 // 10s timeout
    });

    if (response.data && response.data.candidates && response.data.candidates[0].content) {
      return response.data.candidates[0].content.parts[0].text.trim();
    }
    throw new Error("Invalid response structure from Gemini");
  } catch (error) {
    if (error.response) {
      console.error(`Gemini API Error (${error.response.status}):`, JSON.stringify(error.response.data, null, 2));
      throw new Error(`Gemini API returned ${error.response.status}`);
    }
    console.error("Gemini Connection Error:", error.message);
    throw error;
  }
};

/**
 * Generate a professional resume summary
 */
const generateSummary = async (data) => {
  console.log("Service: Generating Summary for", data?.name || 'Unknown');
  try {
    const { name, experience, skills, projects } = data;
    const prompt = `
      You are an expert resume writer. Generate a professional, high-impact resume summary for:
      Name: ${name}
      Experience: ${experience}
      Skills: ${skills}
      Projects: ${projects}

      Requirements:
      - 3-5 sentences maximum.
      - Focus on technical expertise and achievements.
    `;
    return await callGemini(prompt);
  } catch (error) {
    console.log("🔄 Fallback: Generating generic summary due to API failure.");
    return `Experienced professional with expertise in ${data?.skills || 'modern technology'}. Proven track record in ${data?.experience?.substring(0, 50) || 'project delivery'} and building scalable solutions.`;
  }
};

/**
 * Analyze resume for ATS score and suggestions
 */
const generateATSScore = async (resumeText) => {
  console.log("Service: Analyzing ATS Score...");
  try {
    const prompt = `
      Analyze this resume text and provide:
      1. ATS Score (0-100).
      2. 3 suggestions for improvement.
      Resume: ${resumeText}
      Return ONLY JSON: {"score": 85, "suggestions": ["link1", "link2"]}
    `;
    const resText = await callGemini(prompt);
    const jsonMatch = resText.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.log("🔄 Fallback: Returning mock ATS score.");
    return { score: 75, suggestions: ["Add more quantifiable results", "Optimize for keywords", "Check contact section"] };
  }
};

/**
 * Suggest relevant skills for a job role
 */
const suggestSkills = async (role) => {
  console.log("Service: Suggesting Skills for", role);
  try {
    const prompt = `List 10 comma-separated skills for a ${role} resume. No other text.`;
    const resText = await callGemini(prompt);
    return resText.split(',').map(s => s.trim());
  } catch (error) {
    console.log("🔄 Fallback: Returning default skills.");
    return ["React", "JavaScript", "Problem Solving", "Communication", "Teamwork"];
  }
};

/**
 * Generate bullet points
 */
const generateBulletPoints = async (jobTitle) => {
  console.log("Service: Generating Bullets for", jobTitle);
  try {
    const prompt = `Generate 5 professional resume bullet points for a ${jobTitle}. Format with dashes.`;
    const resText = await callGemini(prompt);
    return resText.split('\n').map(line => line.replace(/^[-] /, '').trim()).filter(l => l);
  } catch (error) {
    return ["Developed scalable applications.", "Optimized system performance.", "Collaborated with cross-functional teams."];
  }
};

module.exports = {
  generateSummary,
  generateATSScore,
  suggestSkills,
  generateBulletPoints
};
