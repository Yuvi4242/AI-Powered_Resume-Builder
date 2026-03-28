/**
 * aiService.js
 * Unified AI Service for Resume Generation using Groq.
 * Standardizes all AI calls, validates input, and cleans output.
 */

const { generateText, generateJSON } = require('./groqService');
const prompts = require('./promptService');
const validateAIInput = require('../utils/validateAIInput');
const aiResponseParser = require('../utils/aiResponseParser');

/**
 * Maps multiple frontend and chatbot action strings to canonical AI prompt types.
 */
const normalizeAction = (action) => {
  if (!action) return 'chat';
  const a = action.toString().toUpperCase().trim();
  
  // 1. ATS & Analysis
  if (['ATS', 'ATS_SCAN', 'DEEP_SCAN', 'ANALYZE', 'RESCAN', 'ATS_ANALYSIS', 'ATS_ANALYZE', 'SCAN'].includes(a)) return 'ats';
  
  // 2. Resume Sections
  if (['SUMMARY', 'GENERATE_SUMMARY', 'IMPROVE_SUMMARY', 'REWRITE_SUMMARY'].includes(a)) return 'summary';
  if (['EXPERIENCE', 'IMPROVE_EXPERIENCE', 'BULLETS', 'GENERATE_BULLETS', 'IMPROVE_BULLETS'].includes(a)) return 'experience';
  if (['PROJECT', 'PROJECTS', 'REWRITE_PROJECT', 'IMPROVE_PROJECT'].includes(a)) return 'project';
  if (['SKILLS', 'SUGGEST_SKILLS', 'ADD_SKILL', 'KEYWORDS'].includes(a)) return 'skills';
  
  // 3. Specialized Tools
  if (['OPTIMIZE', 'ROLE_OPTIMIZE', 'JOB_ALIGN', 'TAILOR'].includes(a)) return 'optimize';
  if (['REVIEW', 'RESUME_REVIEW', 'CRITIQUE'].includes(a)) return 'review';
  if (['GRAMMAR', 'FIX_GRAMMAR', 'TEXT_TOOL'].includes(a)) return 'text-tool';

  // 4. Fallback to Chat
  if (['CHAT', 'COPILOT', 'ASSISTANT', 'NONE'].includes(a)) return 'chat';

  return a.toLowerCase(); 
};

const aiService = {
  async generate(rawAction, options = {}) {
    const promptType = normalizeAction(rawAction);
    console.log(`[AIService] Starting Task: ${promptType} (Input: ${rawAction})`);
    
    try {
      // 1. Validate Input
      const validation = validateAIInput(promptType, options);
      if (!validation.valid) {
        console.warn(`[AIService] Validation failed for ${promptType}:`, validation.error);
        return { success: false, error: validation.error };
      }

      // 2. Execute Based on Type
      let response;
      let prompt;

      switch (promptType) {
        case 'ats':
          const resumeForAts = options.resumeData || options.resumeText || options.formData || options;
          prompt = prompts.atsAnalysisPrompt({ ...options, resumeData: resumeForAts });
          response = await generateJSON(prompt);
          // Standardize ATS response
          return {
            success: true,
            data: {
              content: response.summary || "Analysis complete.",
              score: response.score || 0,
              breakdown: response.breakdown || {},
              suggestions: response.suggestions || [],
              missingKeywords: response.missingKeywords || [],
              meta: { action: 'ats', provider: 'groq' }
            }
          };

        case 'summary':
          prompt = prompts.summaryPrompt(options);
          response = await generateText(prompt);
          break;

        case 'experience':
          prompt = prompts.experiencePrompt(options);
          response = await generateText(prompt);
          break;

        case 'project':
          prompt = prompts.projectPrompt(options);
          response = await generateText(prompt);
          break;

        case 'skills':
          prompt = prompts.skillsPrompt(options);
          response = await generateText(prompt);
          break;

        case 'optimize':
          prompt = prompts.roleOptimizePrompt(options);
          response = await generateJSON(prompt);
          break;

        case 'review':
          prompt = prompts.resumeReviewPrompt(options);
          response = await generateJSON(prompt);
          break;

        case 'text-tool':
          prompt = prompts.textToolPrompt(options);
          response = await generateText(prompt);
          break;

        case 'chat':
          prompt = prompts.copilotPrompt(options);
          response = await generateJSON(prompt);
          return { success: true, data: response }; // Return full JSON from Copilot

        default:
          console.error(`[AIService Error] No handler for type: ${promptType}`);
          throw new Error(`Unsupported prompt type: ${promptType}`);
      }

      // 3. Final cleanup for text-based responses
      const cleanContent = typeof response === 'string' ? aiResponseParser(response) : response;

      return {
        success: true,
        data: {
          content: cleanContent,
          meta: { action: promptType, provider: 'groq' }
        }
      };

    } catch (error) {
      console.error(`[AIService Catch] ${promptType} failed:`, error.message);
      return {
        success: false,
        message: 'AI Task failed',
        error: error.message
      };
    }
  }
};

module.exports = aiService;
