const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const testAll = async () => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  const models = ["gemini-1.5-flash", "gemini-pro", "gemini-1.0-pro"];
  const versions = ["v1", "v1beta"];
  
  for (const v of versions) {
    for (const m of models) {
      try {
        console.log(`Testing ${m} on ${v}...`);
        const model = genAI.getGenerativeModel({ model: m }, { apiVersion: v });
        const result = await model.generateContent("test");
        console.log(`✅ SUCCESS: ${m} works on ${v}`);
        process.exit(0);
      } catch (e) {
        console.log(`❌ FAILED: ${m} on ${v} -> ${e.message}`);
      }
    }
  }
};

testAll();
