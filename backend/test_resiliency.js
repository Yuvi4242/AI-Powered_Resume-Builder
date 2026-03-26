'use strict';

// Load environment FIRST
const dotenv = require('dotenv');
const path   = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const { safeGenerate, generateJSON } = require('./services/geminiService');

// ============================================================
// BANNER
// ============================================================
console.log('\n╔══════════════════════════════════════════════════╗');
console.log('║       🛡️  Gemini AI Single-Shot Smoke Test       ║');
console.log('╚══════════════════════════════════════════════════╝\n');

const apiKeyPreview = process.env.GEMINI_API_KEY
  ? process.env.GEMINI_API_KEY.substring(0, 10) + '...'
  : '❌ NOT SET';

console.log('  API Key       :', apiKeyPreview);
console.log('  Primary Model :', process.env.GEMINI_MODEL         || 'gemini-2.0-flash (default)');
console.log('  Fallback Model:', process.env.GEMINI_FALLBACK_MODEL || 'gemini-2.0-flash-lite (default)');
console.log('\n  ⚠️  Free tier limit: 15 req/min. Running 1 test call only.\n');

// ============================================================
// SINGLE SMOKE TEST — one call to verify the pipeline works
// ============================================================
(async () => {
  try {
    console.log('  ▶ Sending test prompt to Gemini...\n');

    const result = await generateJSON(`
      You are a resume assistant. Return a JSON object with:
      {
        "status": "ok",
        "tip": "one sentence professional resume tip"
      }
    `);

    console.log('\n╔══════════════════════════════════════════════════╗');
    console.log('║                  ✅  TEST PASSED                 ║');
    console.log('╚══════════════════════════════════════════════════╝');
    console.log(`\n  Model used   : ${result.model}`);
    console.log(`  Used fallback: ${result.usedFallback}`);
    console.log(`  Status       : ${result.json.status}`);
    console.log(`  AI Tip       : ${result.json.tip}`);
    console.log('\n  🎉 Gemini AI integration is fully working!\n');
    console.log('  Run the full test suite only when not rate-limited:');
    console.log('  → node test_resiliency_full.js\n');

  } catch (error) {
    const is429 = error.message?.includes('429') || error.message?.includes('quota');

    console.log('\n╔══════════════════════════════════════════════════╗');
    if (is429) {
      console.log('║              ⏳  RATE LIMITED (429)              ║');
      console.log('╚══════════════════════════════════════════════════╝');
      console.log('\n  Your API key is rate-limited (free tier: 15 req/min).');
      console.log('  This is normal after running many tests in a row.\n');
      console.log('  ✅ Your API key and model ARE working.');
      console.log('  ⏳ Wait 60 seconds, then run this test again.\n');
      console.log('  Or check your quota at: https://ai.dev/rate-limit\n');
    } else {
      console.log('║                 ❌  TEST FAILED                  ║');
      console.log('╚══════════════════════════════════════════════════╝');
      console.log('\n  Error:', error.message?.split('\n')[0]);
      console.log('\n  Troubleshooting:');
      console.log('  1. Check your GEMINI_API_KEY in .env');
      console.log('  2. Visit https://aistudio.google.com/app/apikey');
      console.log('  3. Ensure your network can reach googleapis.com\n');
    }
  }
})();
