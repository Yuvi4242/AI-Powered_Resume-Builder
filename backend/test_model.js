const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const testModel = async () => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Say hello");
    console.log("Model Result:", result.response.text());
  } catch (error) {
    console.error("Model Error:", error.message);
    if (error.message.includes("404")) {
      console.log("Model 404 detected. Trying gemini-pro...");
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Say hello");
        console.log("Gemini-pro Result:", result.response.text());
      } catch (err2) {
        console.error("Gemini-pro also failed:", err2.message);
      }
    }
  }
};

testModel();
