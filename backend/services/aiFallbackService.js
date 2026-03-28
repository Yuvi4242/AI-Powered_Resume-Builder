const { asStringArray, asSummary } = require('../utils/aiResponseFormatter');
const { safePlainText, normalizeBullets } = require('../utils/aiSanitizer');

const ACTION_VERBS = [
  'Built', 'Developed', 'Designed', 'Implemented', 'Optimized', 'Improved', 'Led', 'Owned',
  'Delivered', 'Automated', 'Integrated', 'Deployed', 'Refactored', 'Collaborated', 'Analyzed',
];

const ROLE_SKILL_MAP = {
  'frontend': ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Redux', 'Next.js', 'Testing (Jest)'],
  'backend': ['Node.js', 'Express', 'MongoDB', 'REST APIs', 'Auth/JWT', 'SQL', 'Caching', 'Testing'],
  'full stack': ['React', 'Node.js', 'Express', 'MongoDB', 'REST APIs', 'TypeScript', 'Git', 'Deployment'],
  'java': ['Java', 'Spring Boot', 'OOP', 'DSA', 'SQL', 'REST APIs', 'JUnit', 'Microservices'],
  'data analyst': ['SQL', 'Excel', 'Power BI', 'Tableau', 'Python', 'Pandas', 'Statistics', 'Dashboards'],
  'fresher': ['DSA', 'OOP', 'Git', 'Problem Solving', 'Communication', 'Projects', 'Basics of DBMS', 'OS'],
};

const detectRoleBucket = (role = '') => {
  const r = role.toLowerCase();
  if (r.includes('front')) return 'frontend';
  if (r.includes('back')) return 'backend';
  if (r.includes('full')) return 'full stack';
  if (r.includes('java')) return 'java';
  if (r.includes('data') || r.includes('analyst') || r.includes('business intelligence')) return 'data analyst';
  if (r.includes('fresher') || r.includes('student') || r.includes('intern') || r.includes('entry')) return 'fresher';
  return 'full stack';
};

const uniq = (arr) => Array.from(new Set((arr || []).filter(Boolean)));

const extractKeywords = (text, limit = 25) => {
  const t = safePlainText(text || '', 6000).toLowerCase();
  const tokens = t
    .replace(/[^a-z0-9+\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .filter((w) => w.length >= 3 && w.length <= 24);

  const stop = new Set(['the','and','for','with','this','that','from','have','has','had','are','was','were','your','you','our','their','into','using','use','used','over','more','less','than','then','also','etc']);
  const freq = new Map();
  for (const w of tokens) {
    if (stop.has(w)) continue;
    freq.set(w, (freq.get(w) || 0) + 1);
  }
  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([w]) => w);
};

const generateSummaryFallback = (profileData = {}) => {
  const role = safePlainText(profileData.currentRole || profileData.jobTitle || profileData.role || 'Software Engineer', 80);
  const level = safePlainText(profileData.experienceLevel || profileData.level || '', 40);
  const rawSkills = profileData.technicalSkills || profileData.skills || [];
  const skills = Array.isArray(rawSkills)
    ? rawSkills
    : String(rawSkills).split(',').map((s) => s.trim()).filter(Boolean);

  const topSkills = skills.slice(0, 4).join(', ') || 'modern web development';
  const levelHint = level ? `${level} ` : '';

  const options = [
    `${levelHint}${role} with strong fundamentals in ${topSkills}. Experienced in building clean, user-focused solutions and collaborating across teams to ship reliable features.`,
    `Motivated ${role} skilled in ${topSkills}. Focused on writing maintainable code, solving problems end-to-end, and continuously improving product quality and performance.`,
    `${role} with hands-on experience across ${topSkills}. Passionate about delivering scalable, production-ready features and improving user experience through thoughtful engineering.`,
  ];

  return {
    summaryOptions: options.map(asSummary).slice(0, 3),
    summary: asSummary(options[0]),
  };
};

const suggestSkillsFallback = (role = '', context = {}) => {
  const bucket = detectRoleBucket(role);
  const base = ROLE_SKILL_MAP[bucket] || ROLE_SKILL_MAP['full stack'];

  const resumeText = safePlainText(context.resumeText || '', 6000);
  const projectText = safePlainText(context.projects || '', 2000);
  const extracted = extractKeywords([resumeText, projectText, role].filter(Boolean).join(' '), 20);

  const combined = uniq([...base, ...extracted.map((k) => k.toUpperCase() === 'sql' ? 'SQL' : k)]);
  const technical = combined.filter((s) => /^[A-Za-z0-9.+/#\-\s]{2,}$/.test(s)).slice(0, 16);

  return {
    categories: {
      technical: technical.slice(0, 10),
      tools: technical.slice(10, 14),
      soft: ['Communication', 'Teamwork', 'Problem Solving', 'Ownership'],
      domain: bucket === 'data analyst' ? ['Data visualization', 'Reporting', 'Stakeholder management'] : ['Agile', 'SDLC'],
    },
    skills: technical.slice(0, 10),
  };
};

const improveBulletsFallback = (input, opts = {}) => {
  const bullets = Array.isArray(input) ? input : normalizeBullets(input);
  const role = safePlainText(opts.role || '', 80);

  const improved = bullets.map((b, idx) => {
    const verb = ACTION_VERBS[idx % ACTION_VERBS.length];
    const core = safePlainText(b, 240);
    if (!core) return null;
    const metricHint = core.match(/\d/) ? '' : ' (improved performance/quality)';
    const roleHint = role ? ` for ${role}` : '';
    return `${verb}${roleHint} ${core.replace(/^\w+ed\s+/i, '').replace(/^\w+\s+/i, '')}${metricHint}`.replace(/\s+/g, ' ').trim();
  }).filter(Boolean);

  return { improvedBullets: asStringArray(improved, 30) };
};

const enhanceProjectFallback = (text, opts = {}) => {
  const name = safePlainText(opts.projectName || '', 60);
  const raw = safePlainText(text, 1200);
  const bullets = improveBulletsFallback(raw).improvedBullets.slice(0, 3);

  const header = name ? `${name}: ` : '';
  const enhanced = header + bullets.join(' ');
  return { enhanced: asSummary(enhanced) };
};

const atsOptimizeFallback = (resumeText = '', jobDescription = '', opts = {}) => {
  const role = safePlainText(opts.role || '', 80);
  const rKeys = extractKeywords(resumeText, 25);
  const jKeys = extractKeywords(jobDescription, 25);

  const missing = jKeys.filter((k) => !rKeys.includes(k)).slice(0, 12);
  const present = jKeys.filter((k) => rKeys.includes(k)).slice(0, 12);

  const score = Math.max(35, Math.min(92, 45 + present.length * 3 - missing.length));
  const suggestions = [
    role ? `Mirror the job description language for the ${role} role (titles, tools, and keywords).` : 'Mirror the job description language (titles, tools, and keywords).',
    'Add measurable impact: latency %, cost savings, throughput, revenue, users, or time saved.',
    'Ensure your top skills appear in both the Skills section and in relevant experience bullets.',
    missing.length ? `Consider adding relevant keywords (where truthful): ${missing.slice(0, 6).join(', ')}.` : 'You already match many key terms—focus on adding metrics and clarity.',
  ];

  return {
    score,
    suggestions: asStringArray(suggestions, 10),
    missingKeywords: asStringArray(missing, 20),
  };
};

const copilotChatFallback = (message = '', context = {}) => {
  const msg = safePlainText(message, 800).toLowerCase();
  const role = safePlainText(context.role || context.currentRole || '', 80);

  const replyFor = () => {
    if (msg.includes('summary')) {
      const { summary } = generateSummaryFallback({ currentRole: role || 'Software Engineer', skills: context.skills || [] });
      return { reply: `Here’s a solid summary you can use:\n${summary}`, action: 'NONE', data: {} };
    }
    if (msg.includes('ats')) {
      const tips = atsOptimizeFallback(context.resumeText || '', context.jobDescription || '', { role }).suggestions;
      return { reply: `ATS tips:\n- ${tips.slice(0, 3).join('\n- ')}`, action: 'NONE', data: {} };
    }
    if (msg.includes('skill')) {
      const s = suggestSkillsFallback(role || 'Software Engineer', context).categories.technical.slice(0, 8);
      return { reply: `For ${role || 'your target role'}, prioritize these skills:\n- ${s.join('\n- ')}`, action: 'NONE', data: {} };
    }
    if (msg.includes('interview')) {
      return { reply: 'Interview prep: be ready to explain 2 projects end-to-end (problem, approach, trade-offs, impact), revise core CS/DB basics, and practice 6–10 common behavioral questions using STAR.', action: 'NONE', data: {} };
    }
    if (msg.includes('project idea') || msg.includes('projects')) {
      return { reply: 'Project ideas: build a job-tracker with analytics, an ATS-friendly resume analyzer, a role-based mock interview app, or a full-stack CRUD app with auth + caching + tests. Tell me your target role and stack and I’ll tailor 3 ideas.', action: 'NONE', data: {} };
    }
    return { reply: 'Tell me your target role and paste your current summary/experience bullets. I’ll suggest concrete improvements (strong verbs, metrics, keyword alignment, and ATS-friendly formatting).', action: 'NONE', data: {} };
  };

  return replyFor();
};

module.exports = {
  generateSummaryFallback,
  suggestSkillsFallback,
  improveBulletsFallback,
  enhanceProjectFallback,
  atsOptimizeFallback,
  copilotChatFallback,
};

