/**
 * aiService.js
 * Unified AI Service for Resume Generation using Groq.
 * Standardizes all AI calls, validates input, and cleans output.
 */

const { generateText, generateJSON } = require('./groqService');
const prompts = require('./promptService');
const validateAIInput = require('../utils/validateAIInput');
const aiResponseParser = require('../utils/aiResponseParser');

const aiService = {
  /**
   * Universal AI generation method
   * @param {string} promptType - The type of prompt to generate
   * @param {object} options - Options for the prompt template
   */
  async generate(promptType, options = {}) {
    try {
      // 1. Validate Input
      const validation = validateAIInput(promptType, options);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error
        };
      }

      // 2. Build Prompt
      let prompt = "";
      switch (promptType) {
        case 'summary':
          prompt = prompts.summaryPrompt(options);
          break;
        case 'experience':
          prompt = prompts.experiencePrompt(options);
          break;
        case 'project':
          prompt = prompts.projectPrompt(options);
          break;
        case 'skills':
          prompt = prompts.skillsPrompt(options);
          break;
        case 'text-tool':
          prompt = prompts.textToolPrompt(options);
          break;
        case 'optimize':
          prompt = prompts.optimizePrompt(options);
          break;
        case 'chat':
        case 'copilot':
          prompt = prompts.copilotPrompt(options);
          break;
        default:
          throw new Error(`Unsupported prompt type: ${promptType}`);
      }

      // 3. Call AI Provider (Groq)
      console.log(`[AIService] Processing generation for: ${promptType}`);
      const rawResult = await generateText(prompt);
      
      // 4. Parse & Clean Response
      const cleanContent = aiResponseParser(rawResult);

      return {
        success: true,
        message: 'AI content generated successfully',
        data: {
          content: cleanContent,
          meta: {
            provider: 'groq',
            model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'
          }
        }
      };
    } catch (error) {
      console.error(`[AIService Error] ${promptType}:`, error.message);
      return {
        success: false,
        message: 'AI generation failed',
        error: error.message
      };
    }
  },

  // Helper methods for semantic clarity
  async generateSummary(data) { return this.generate('summary', data); },
  async generateExperience(data) { return this.generate('experience', data); },
  async generateProject(data) { return this.generate('project', data); },
  async suggestSkills(data) { return this.generate('skills', data); },
  async runTextTool(data) { return this.generate('text-tool', data); },
  async optimizeForJD(data) { return this.generate('optimize', data); },
  async chatResponse(data) { return this.generate('chat', data); }
};

module.exports = aiService;
