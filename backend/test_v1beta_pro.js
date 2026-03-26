const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const testV1Beta = async () => {
    const key = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : "";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${key}`;
    
    try {
        console.log("Testing RAW axios to v1beta + gemini-pro...");
        const res = await axios.post(url, {
            contents: [{ parts: [{ text: "ping" }] }]
        });
        console.log("✅ SUCCESS on v1beta/gemini-pro!");
    } catch (err) {
      if (err.response) {
        console.error("❌ FAILED on v1beta/gemini-pro:", err.response.status, JSON.stringify(err.response.data, null, 2));
      } else {
        console.error("❌ HANGED or NETWORK Error:", err.message);
      }
    }
};

testV1Beta();
