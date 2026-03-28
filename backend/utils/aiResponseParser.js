/**
 * aiResponseParser.js
 * Parses and cleans AI responses from the AI provider.
 * Groq (Llama-3) can sometimes include markdown or preambles.
 */

const aiResponseParser = (response) => {
  if (!response) return '';

  // 1. Extract text from Groq response structure if passed as an object
  let text = typeof response === 'string' ? response : (response.choices?.[0]?.message?.content || '');

  if (!text) return '';

  // 2. Remove common AI preambles
  const preambles = [
    /^Here is a professional summary.*:/i,
    /^Here are some bullet points.*:/i,
    /^Based on your input, here is.*:/i,
    /^Generated summary:$/i,
    /^Sure, here is the.*:/i,
    /^Revised text:$/i,
    /^Optimized for ATS:$/i
  ];

  preambles.forEach(regex => {
    text = text.replace(regex, '').trim();
  });

  // 3. Remove markdown code blocks (e.g. ```markdown ... ```)
  text = text.replace(/```[a-z]*\n([\s\S]*?)\n```/g, '$1').trim();
  text = text.replace(/```/g, '').trim();

  // 4. Remove leading/trailing quotes if the AI wrapped the whole thing
  if (text.startsWith('"') && text.endsWith('"')) {
    text = text.slice(1, -1).trim();
  }

  // 5. Remove any remaining "assistant:" prefixes if they appear
  text = text.replace(/^assistant:\s*/i, '').trim();

  return text;
};

module.exports = aiResponseParser;
