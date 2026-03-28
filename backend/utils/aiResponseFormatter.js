const { normalizeBullets, safePlainText } = require('./aiSanitizer');

const asStringArray = (val, maxItems = 50) => {
  if (!val) return [];
  const arr = Array.isArray(val) ? val : normalizeBullets(val);
  return arr
    .map((x) => safePlainText(x, 300))
    .filter(Boolean)
    .slice(0, maxItems);
};

const asSummary = (val) => {
  const text = safePlainText(val, 1200);
  // keep it readable and resume-safe
  return text.replace(/\n{3,}/g, '\n\n').trim();
};

module.exports = {
  asStringArray,
  asSummary,
};

