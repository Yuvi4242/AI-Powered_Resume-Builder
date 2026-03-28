/**
 * validateAIInput.js
 * Validates user input before calling the AI provider.
 */

const validateAIInput = (action, data) => {
  if (!action) return { valid: false, error: 'Action is required.' };

  const d = data.resumeData || data.resumeText || data.formData || data;

  switch (action) {
    case 'summary':
    case 'generate_summary':
      if (!d.role && !d.skills && !d.experience && !d.summary) {
        return { valid: false, error: 'Summary generation requires role, skills, or experience context.' };
      }
      break;

    case 'experience':
    case 'bullets':
    case 'generate_bullets':
      if (!d.jobTitle && !d.text && !d.description && !d.experience) {
        return { valid: false, error: 'Experience generation requires a job title or raw description.' };
      }
      break;

    case 'project':
    case 'generate_project':
    case 'rewrite_project':
      if (!d.title && !d.technologies && !d.features && !d.projects) {
        return { valid: false, error: 'Project rewrite requires title, tech stack, or feature list.' };
      }
      break;

    case 'skills':
    case 'suggest_skills':
      if (!d.role && !d.currentSkills && !d.skills) {
        return { valid: false, error: 'Skill suggestions require a target role or current skill context.' };
      }
      break;

    case 'ats':
    case 'optimize':
    case 'ats_analysis':
    case 'ats_analyze':
    case 'rescan':
      if (!d.resumeText && !d.resumeData && !d.experience && !d.skills && !d.formData) {
        return { valid: false, error: 'ATS/Optimization requires resume context (text or data).' };
      }
      break;

    case 'review':
    case 'resume_review':
      if (!d.resumeData && !d.formData && !d.experience) {
        return { valid: false, error: 'Resume review requires resume context.' };
      }
      break;

    case 'improvement':
    case 'improve':
    case 'fix':
      if (!d.content && !d.text && !d.summary && !d.experience) {
        return { valid: false, error: 'Improvement actions require original content.' };
      }
      break;
    
    case 'text_tool':
    case 'rewrite':
    case 'grammar':
      if (!d.text && !d.content) {
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
