const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '.env') });

async function findWorkingModel() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('❌ GEMINI_API_KEY not found in .env');
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Testing models in order of likelihood (considering it's 2026)
    const modelsToTest = [
        'gemini-2.0-flash',
        'gemini-1.5-flash',
        'gemini-1.5-flash-8b',
        'gemini-1.5-flash-latest',
        'gemini-pro'
    ];

    console.log('--- 🛡️ Model Access Diagnostic ---');
    
    for (const modelName of modelsToTest) {
        process.stdout.write(`Testing ${modelName}... `);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent('ping');
            const response = await result.response;
            console.log(`✅ SUCCESS! Output: "${response.text().trim()}"`);
            // We found a working model!
            return modelName;
        } catch (error) {
            console.log(`❌ FAILED: ${error.message.split('\n')[0].substring(0, 50)}...`);
        }
    }
    
    console.log('--- 🏁 Diagnostic Complete ---');
}

findWorkingModel().then(workingModel => {
    if (workingModel) {
        console.log(`\n🎉 SUGGESTION: Update your model to "${workingModel}" in aiService.js`);
    } else {
        console.log('\n❌ No models worked. Please check if your API key is restricted or if the Gemini API is available in your region.');
    }
});
