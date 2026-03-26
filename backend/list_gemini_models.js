const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '.env') });

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('❌ GEMINI_API_KEY not found in .env');
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        console.log('--- Fetching Available Models ---');
        // This is a common way to debug 404s in Gemini SDK
        // Note: The SDK itself doesn't have a direct 'listModels' on the genAI instance 
        // that works without potentially hitting the same version issue easily.
        // We'll try to just hit 'gemini-pro' as a fallback to see if the key works at all.
        
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent('Hi');
        const response = await result.response;
        console.log('✅ Connection Successful with gemini-pro');
        console.log('Response:', response.text());
        
    } catch (error) {
        console.error('❌ Error with gemini-pro:', error.message);
        console.log('\nTrying gemini-1.5-flash-latest...');
        try {
            const model15 = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
            const result15 = await model15.generateContent('Hi');
            const response15 = await result15.response;
            console.log('✅ Connection Successful with gemini-1.5-flash-latest');
        } catch (err) {
            console.error('❌ Error with gemini-1.5-flash-latest:', err.message);
        }
    }
}

listModels();
