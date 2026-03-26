/**
 * geminiConfig.js
 * 
 * This is now a thin re-export shim.
 * All real logic lives in services/geminiService.js
 * This file exists for backward-compatibility with any code that imports from config/geminiConfig.
 */
const { safeGenerate, generateText, generateJSON } = require('../services/geminiService');

// Legacy getModel() compatibility shim — returns an object that exposes generateContent
const getModel = () => {
  return {
    generateContent: async (prompt) => {
      const result = await safeGenerate(prompt);
      return {
        response: {
          text: () => result.text,
        },
      };
    },
  };
};

module.exports = { getModel, safeGenerate, generateText, generateJSON };
