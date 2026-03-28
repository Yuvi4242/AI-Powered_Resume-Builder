const fs = require('fs');
const path = require('path');

const filesToTarget = [
  'backend/check_key.js',
  'backend/diagnose_model.js',
  'backend/find_working_model.js',
  'backend/list_gemini_models.js',
  'backend/list_models.js',
  'backend/test_ai.js',
  'backend/test_all_versions.js',
  'backend/test_gemini_verify.js',
  'backend/test_model.js',
  'backend/test_profile_api.js',
  'backend/test_raw_v1.js',
  'backend/test_resiliency.js',
  'backend/test_v1_constructor.js',
  'backend/test_v1beta_pro.js',
  'backend/config/geminiConfig.js',
  'frontend/src/pages/ProfilePlaceholder.js'
];

filesToTarget.forEach(f => {
  const fullPath = path.join(__dirname, f);
  if (fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath);
      console.log(`Deleted: ${f}`);
    } catch (err) {
      console.error(`Error deleting ${f}: ${err.message}`);
    }
  } else {
    console.log(`Not found: ${f}`);
  }
});
