const stripCodeFences = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/^```[a-z]*\s*/i, '')
    .replace(/```$/i, '')
    .trim();
};

const normalizeBullets = (input) => {
  if (!input) return [];
  const lines = Array.isArray(input) ? input : String(input).split('\n');
  return lines
    .map((l) => String(l).trim())
    .filter(Boolean)
    .map((l) => l.replace(/^[-*•\u2022]\s+/, ''))
    .map((l) => l.replace(/\s+/g, ' '))
    .filter(Boolean);
};

const safePlainText = (text, maxLen = 4000) => {
  if (!text) return '';
  let t = String(text);
  t = stripCodeFences(t);
  t = t.replace(/\u0000/g, '');
  t = t.trim();
  if (t.length > maxLen) t = t.slice(0, maxLen).trim();
  return t;
};

module.exports = {
  stripCodeFences,
  normalizeBullets,
  safePlainText,
};

