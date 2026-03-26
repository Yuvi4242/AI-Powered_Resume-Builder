const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const testV1 = async () => {
  try {
    // Attempting to force v1 in the constructor
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, { apiVersion: 'v1' });
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    console.log("Testing gemini-1.5-flash on v1...");
    const result = await model.generateContent("hello");
    console.log("SUCCESS:", result.response.text());
  } catch (err) {
    console.error("FAILED:", err.message);
    // If it still says v1beta in the error URL, then the SDK is ignoring the option
  }
};

testV1();
