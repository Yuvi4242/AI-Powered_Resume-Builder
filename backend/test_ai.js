const axios = require('axios');

const testAI = async () => {
  try {
    console.log("Testing AI Summary...");
    const res = await axios.post('http://localhost:5000/api/ai/summary', {
      data: {
        name: "Test User",
        skills: "React, Node.js",
        experience: "3 years experience"
      }
    });
    console.log("Response:", JSON.stringify(res.data, null, 2));
    
    if (res.data.success && res.data.result) {
      console.log("✅ AI Summary Test Passed!");
    } else {
      console.log("❌ AI Summary Test Failed!");
    }
  } catch (err) {
    console.error("❌ Test Failed:", err.message);
  }
};

testAI();
