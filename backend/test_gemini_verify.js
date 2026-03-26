const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '.env') });

async function verifyGemini() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('❌ GEMINI_API_KEY not found in .env');
        return;
    }

    console.log('--- Gemini SDK Verification ---');
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        
        const prompt = 'Hello Gemini! Give me a one-sentence professional resume tip.';
        const result = await model.generateContent(prompt);
        const response = await result.response;
        console.log('✅ SDK Response:', response.text());
        console.log('\n--- SUCCESS ---');
    } catch (error) {
        console.error('❌ SDK Error:', error.message);
    }
}

verifyGemini();
