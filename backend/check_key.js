const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const checkKey = async () => {
    const key = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : "";
    console.log("Checking Key:", key.substring(0, 10) + "...");
    
    if (!key) {
        console.error("❌ GEMINI_API_KEY is not set in .env!");
        return;
    }

    const url = `https://generativelanguage.googleapis.com/v1/models?key=${key}`;
    
    try {
        console.log("Attempting to list models via v1...");
        const res = await axios.get(url);
        console.log("✅ API Key is VALID!");
        console.log("Available Models:", res.data.models.length);
        const flash = res.data.models.find(m => m.name.includes("1.5-flash"));
        if (flash) {
            console.log("✅ Gemini 1.5 Flash is AVAILABLE: ", flash.name);
        } else {
            console.log("❌ Gemini 1.5 Flash is NOT found in your available models.");
        }
    } catch (err) {
        if (err.response) {
            console.error("❌ API ERROR:", err.response.status, err.response.data.error?.message || "Unknown error");
            if (err.response.status === 400) console.log("Tip: Check if your API Key has any special characters or spaces.");
            if (err.response.status === 403) console.log("Tip: This key might not be authorized for the Generative Language API. Check your Google AI Studio settings.");
        } else {
            console.error("❌ NETWORK ERROR:", err.message);
            console.log("Tip: Your internet connection might be blocking Google API requests.");
        }
    }
};

checkKey();
