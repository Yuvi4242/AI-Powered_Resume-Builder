/**
 * Quick diagnostic to find which model name actually works with this API key.
 * Tries models one by one with a 10-second timeout per attempt.
 */
'use strict';

const dotenv = require('dotenv');
const path   = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = process.env.GEMINI_API_KEY;

// All valid model names to try (from official Google AI docs, current as of 2026)
const MODELS_TO_TRY = [
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
  'gemini-1.5-pro-latest',
  'gemini-1.5-pro',
  'gemini-1.0-pro',
];

const tryModel = (modelName) => {
  return new Promise(async (resolve) => {
    const timeout = setTimeout(() => {
      resolve({ model: modelName, success: false, error: 'TIMEOUT after 10s' });
    }, 10000);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Say "OK"');
      const text = (await result.response).text().trim();
      clearTimeout(timeout);
      resolve({ model: modelName, success: true, response: text });
    } catch (err) {
      clearTimeout(timeout);
      const shortErr = err.message?.split('\n')[0]?.substring(0, 80) || 'Unknown error';
      resolve({ model: modelName, success: false, error: shortErr });
    }
  });
};

(async () => {
  console.log('\n🔍 Gemini Model Diagnostic');
  console.log(`   API Key: ${API_KEY?.substring(0, 8)}...`);
  console.log(`   Testing ${MODELS_TO_TRY.length} models (10s timeout each)\n`);

  let workingModel = null;

  for (const modelName of MODELS_TO_TRY) {
    process.stdout.write(`   Testing ${modelName.padEnd(30)} ... `);
    const result = await tryModel(modelName);

    if (result.success) {
      console.log(`✅  "${result.response}"`);
      workingModel = modelName;
      break; // Stop at first working model
    } else {
      console.log(`❌  ${result.error}`);
    }
  }

  console.log('');
  if (workingModel) {
    console.log(`✅ WORKING MODEL FOUND: ${workingModel}`);
    console.log(`\n   Add this to your .env:`);
    console.log(`   GEMINI_MODEL=${workingModel}`);
  } else {
    console.log('❌ No models worked. Possible causes:');
    console.log('   1. API key is invalid or expired');
    console.log('   2. API key has no access to Gemini (check Google AI Studio)');
    console.log('   3. Network/firewall blocking generativelanguage.googleapis.com');
    console.log('\n   Visit: https://aistudio.google.com/app/apikey to verify your key');
  }
  console.log('');
})();
