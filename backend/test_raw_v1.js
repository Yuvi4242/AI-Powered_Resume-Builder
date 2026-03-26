const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const testRaw = async () => {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  try {
    console.log("Testing RAW axios call to v1...");
    const res = await axios.post(url, {
      contents: [{ parts: [{ text: "hello" }] }]
    });
    console.log("SUCCESS:", JSON.stringify(res.data, null, 2));
  } catch (err) {
    if (err.response) {
      console.error("FAILED with status:", err.response.status);
      console.error("Data:", JSON.stringify(err.response.data, null, 2));
    } else {
      console.error("FAILED:", err.message);
    }
  }
};

testRaw();
