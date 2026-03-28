const { safePlainText } = require('./aiSanitizer');

const isEmptyText = (text) => {
  if (text === null || text === undefined) return true;
  const t = safePlainText(text, 5000);
  return !t || !t.trim();
};

const ensureNonEmptyText = (text, errorCode = 'EMPTY_AI_RESPONSE') => {
  if (isEmptyText(text)) {
    const err = new Error('Empty AI response.');
    err.code = errorCode;
    throw err;
  }
  return safePlainText(text, 5000);
};

const ensureNonEmptyArray = (arr, errorCode = 'EMPTY_AI_RESPONSE') => {
  if (!Array.isArray(arr) || arr.filter(Boolean).length === 0) {
    const err = new Error('Empty AI response.');
    err.code = errorCode;
    throw err;
  }
  return arr;
};

module.exports = {
  isEmptyText,
  ensureNonEmptyText,
  ensureNonEmptyArray,
};

