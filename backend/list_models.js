const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const listModels = async () => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Note: To list models, we might need a different approach or just try different versions
    // The SDK doesn't have a direct listModels but we can check the error or try v1
    console.log("Checking API Key availability...");
    
    const models = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-pro", "gemini-1.5-pro"];
    
    for (const modelName of models) {
      try {
        console.log(`Testing model: ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("test");
        console.log(`✅ ${modelName} works!`);
        process.exit(0);
      } catch (e) {
        console.log(`❌ ${modelName} failed: ${e.message}`);
      }
    }
  } catch (err) {
    console.error("General Error:", err.message);
  }
};

listModels();
