/**
 * validateAIInput.js
 * Validates user input before calling the AI provider.
 */

const validateAIInput = (action, data) => {
  if (!action) return { valid: false, error: 'Action is required.' };

  switch (action) {
    case 'summary':
    case 'generate_summary':
      if (!data.role && !data.skills && !data.experience) {
        return { valid: false, error: 'Summary generation requires a role, skills, or experience context.' };
      }
      break;

    case 'experience':
    case 'bullets':
    case 'generate_bullets':
      if (!data.jobTitle && !data.text && !data.description) {
        return { valid: false, error: 'Experience generation requires a job title or raw description.' };
      }
      break;

    case 'project':
    case 'generate_project':
      if (!data.title && !data.technologies && !data.features) {
        return { valid: false, error: 'Project description requires a title, tech stack, or feature list.' };
      }
      break;

    case 'skills':
    case 'suggest_skills':
      if (!data.role && !data.currentSkills) {
        return { valid: false, error: 'Skill suggestions require a target role or current skill context.' };
      }
      break;

    case 'ats':
    case 'optimize':
      if (!data.resumeText && !data.resumeData) {
        return { valid: false, error: 'ATS optimization requires resume content.' };
      }
      break;

    case 'text_tool':
    case 'rewrite':
    case 'grammar':
      if (!data.text) {
        return { valid: false, error: 'Text tools require input text.' };
      }
      break;
    
    case 'chat':
    case 'copilot':
      if (!data.message) {
        return { valid: false, error: 'Chat requires a message.' };
      }
      break;
  }

  return { valid: true };
};

module.exports = validateAIInput;
