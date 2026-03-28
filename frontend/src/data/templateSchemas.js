import { 
  FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase, 
  FiBookOpen, FiAward, FiGlobe, FiZap, FiSliders, 
  FiMessageSquare, FiGithub, FiLinkedin, FiLayers
} from 'react-icons/fi';

export const templateSchemas = {
  template1: {
    id: 'template1',
    sections: [
      {
        id: 'profile',
        label: 'Personal Information',
        icon: 'FiUser',
        fields: [
          { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Alex Rivera' },
          { name: 'email', label: 'Email Address', type: 'email', placeholder: 'alex.rivera@tech.io' },
          { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1 415 555 0123' },
          { name: 'location', label: 'Location', type: 'text', placeholder: 'San Francisco, CA' },
          { name: 'github', label: 'GitHub URL', type: 'text', placeholder: 'github.com/username' },
          { name: 'linkedin', label: 'LinkedIn URL', type: 'text', placeholder: 'linkedin.com/in/username' },
          { name: 'portfolio', label: 'Portfolio/Website', type: 'text', placeholder: 'portfolio.me' },
          { name: 'leetcode', label: 'LeetCode', type: 'text', placeholder: 'leetcode.com/u/...' },
          { name: 'hackerrank', label: 'HackerRank', type: 'text', placeholder: 'hackerrank.com/...' },
          { name: 'twitter', label: 'Twitter/X', type: 'text', placeholder: 'twitter.com/...' },
        ]
      },
      {
        id: 'summary',
        label: 'Professional Summary',
        icon: 'FiMessageSquare',
        fields: [
          { name: 'summary', label: 'Summary', type: 'textarea', placeholder: 'Passionate Full Stack Developer...' }
        ]
      },
      {
        id: 'skills',
        label: 'Core Stack',
        icon: 'FiZap',
        type: 'tags',
        name: 'skills'
      },
      {
        id: 'experience',
        label: 'Work Experience',
        icon: 'FiBriefcase',
        type: 'list',
        name: 'experience',
        fields: [
          { name: 'role', label: 'Role/Position', type: 'text' },
          { name: 'company', label: 'Company Name', type: 'text' },
          { name: 'duration', label: 'Duration', type: 'text', placeholder: '2023 - Present' },
          { name: 'description', label: 'Description', type: 'textarea' }
        ]
      },
      {
        id: 'projects',
        label: 'Technical Projects',
        icon: 'FiLayers',
        type: 'list',
        name: 'projects',
        fields: [
          { name: 'title', label: 'Project Title', type: 'text' },
          { name: 'tech', label: 'Technologies Used', type: 'text' },
          { name: 'description', label: 'Description', type: 'textarea' }
        ]
      },
      {
        id: 'education',
        label: 'Education',
        icon: 'FiBookOpen',
        type: 'list',
        name: 'education',
        fields: [
          { name: 'degree', label: 'Degree', type: 'text' },
          { name: 'school', label: 'School/University', type: 'text' },
          { name: 'year', label: 'Year', type: 'text' }
        ]
      }
    ]
  },
  template2: {
    id: 'template2',
    sections: [
      {
        id: 'profile',
        label: 'Personal Information',
        icon: 'FiUser',
        fields: [
          { name: 'name', label: 'Full Name', type: 'text' },
          { name: 'email', label: 'Email', type: 'email' },
          { name: 'phone', label: 'Phone', type: 'tel' },
          { name: 'linkedin', label: 'LinkedIn', type: 'text' },
          { name: 'github', label: 'GitHub', type: 'text' },
          { name: 'website', label: 'Website', type: 'text' },
        ]
      },
      {
        id: 'summary',
        label: 'Professional Summary',
        icon: 'FiMessageSquare',
        fields: [
          { name: 'summary', label: 'Summary', type: 'textarea' }
        ]
      },
      {
        id: 'skills',
        label: 'Technical Skills',
        icon: 'FiZap',
        type: 'tags',
        name: 'skills'
      },
      {
        id: 'experience',
        label: 'Work Experience',
        icon: 'FiBriefcase',
        type: 'list',
        name: 'experience',
        fields: [
          { name: 'role', label: 'Role', type: 'text' },
          { name: 'company', label: 'Company', type: 'text' },
          { name: 'duration', label: 'Duration', type: 'text' },
          { name: 'description', label: 'Responsibilities', type: 'textarea' }
        ]
      },
      {
        id: 'education',
        label: 'Education',
        icon: 'FiBookOpen',
        type: 'list',
        name: 'education',
        fields: [
          { name: 'degree', label: 'Degree', type: 'text' },
          { name: 'school', label: 'University', type: 'text' },
          { name: 'year', label: 'Year', type: 'text' }
        ]
      }
    ]
  },
  template3: {
    id: 'template3',
    sections: [
      {
        id: 'profile',
        label: 'Contact Info',
        icon: 'FiUser',
        fields: [
          { name: 'name', label: 'Full Name', type: 'text' },
          { name: 'email', label: 'Email', type: 'email' },
          { name: 'phone', label: 'Phone', type: 'tel' },
          { name: 'linkedin', label: 'LinkedIn', type: 'text' },
          { name: 'twitter', label: 'Twitter/X', type: 'text' },
          { name: 'website', label: 'Portfolio', type: 'text' },
        ]
      },
      {
        id: 'summary',
        label: 'Marketing Profile',
        icon: 'FiMessageSquare',
        fields: [
          { name: 'summary', label: 'Summary', type: 'textarea' }
        ]
      },
      {
        id: 'campaigns',
        label: 'Key Campaigns',
        icon: 'FiZap',
        type: 'list',
        name: 'campaigns',
        fields: [
          { name: 'title', label: 'Campaign Title', type: 'text' },
          { name: 'description', label: 'Results & Impact', type: 'textarea' }
        ]
      },
      {
        id: 'skills',
        label: 'Expertise',
        icon: 'FiSliders',
        type: 'tags',
        name: 'skills'
      }
    ]
  },
  template4: {
    id: 'template4',
    sections: [
      {
        id: 'profile',
        label: 'Executive Profile',
        icon: 'FiUser',
        fields: [
          { name: 'name', label: 'Full Name', type: 'text' },
          { name: 'email', label: 'Email', type: 'email' },
          { name: 'phone', label: 'Phone', type: 'text' },
          { name: 'location', label: 'Location', type: 'text' },
          { name: 'linkedin', label: 'LinkedIn', type: 'text' },
          { name: 'website', label: 'Professional Website', type: 'text' },
        ]
      },
      {
        id: 'summary',
        label: 'Executive Summary',
        icon: 'FiMessageSquare',
        fields: [
          { name: 'summary', label: 'Summary', type: 'textarea' }
        ]
      },
      {
        id: 'experience',
        label: 'Professional Experience',
        icon: 'FiBriefcase',
        type: 'list',
        name: 'experience',
        fields: [
          { name: 'role', label: 'Designation', type: 'text' },
          { name: 'company', label: 'Organization', type: 'text' },
          { name: 'duration', label: 'Tenure', type: 'text' },
          { name: 'description', label: 'Key Responsibilities', type: 'textarea' }
        ]
      },
      {
        id: 'skills',
        label: 'Core Competencies',
        icon: 'FiZap',
        type: 'tags',
        name: 'skills'
      },
      {
        id: 'education',
        label: 'Education & Credentials',
        icon: 'FiBookOpen',
        type: 'list',
        name: 'education',
        fields: [
          { name: 'degree', label: 'Degree/Certification', type: 'text' },
          { name: 'school', label: 'Institution', type: 'text' },
          { name: 'year', label: 'Year', type: 'text' }
        ]
      }
    ]
  },
  template5: {
    id: 'template5',
    sections: [
      {
        id: 'profile',
        label: 'Designer Profile',
        icon: 'FiUser',
        fields: [
          { name: 'name', label: 'Full Name', type: 'text' },
          { name: 'email', label: 'Email', type: 'email' },
          { name: 'portfolio', label: 'Portfolio Link', type: 'text' },
          { name: 'behance', label: 'Behance', type: 'text' },
          { name: 'dribbble', label: 'Dribbble', type: 'text' },
          { name: 'instagram', label: 'Instagram', type: 'text' },
        ]
      },
      {
        id: 'skills',
        label: 'Design Stack',
        icon: 'FiSliders',
        type: 'tags',
        name: 'skills'
      },
      {
        id: 'experience',
        label: 'Experience',
        icon: 'FiBriefcase',
        type: 'list',
        name: 'experience',
        fields: [
          { name: 'role', label: 'Role', type: 'text' },
          { name: 'company', label: 'Studio/Agency', type: 'text' },
          { name: 'description', label: 'Project Impact', type: 'textarea' }
        ]
      }
    ]
  },
  template6: {
    id: 'template6',
    sections: [
      {
        id: 'profile',
        label: 'Student Information',
        icon: 'FiUser',
        fields: [
          { name: 'name', label: 'Full Name', type: 'text' },
          { name: 'email', label: 'Email', type: 'email' },
          { name: 'phone', label: 'Phone', type: 'tel' },
          { name: 'city', label: 'City', type: 'text' },
          { name: 'state', label: 'State', type: 'text' },
          { name: 'linkedin', label: 'LinkedIn', type: 'text' },
          { name: 'github', label: 'GitHub', type: 'text' },
          { name: 'leetcode', label: 'LeetCode', type: 'text' },
          { name: 'codechef', label: 'CodeChef', type: 'text' },
        ]
      },
      {
        id: 'education',
        label: 'Academic Background',
        icon: 'FiBookOpen',
        type: 'list',
        name: 'education',
        fields: [
          { name: 'school', label: 'University/College', type: 'text' },
          { name: 'degree', label: 'Degree & CGPA', type: 'text' },
          { name: 'year', label: 'Duration', type: 'text' }
        ]
      },
      {
        id: 'skills',
        label: 'Skills',
        icon: 'FiZap',
        type: 'tags',
        name: 'skills'
      }
    ]
  },
  'sidebar-template': {
    id: 'sidebar-template',
    sections: [
      {
        id: 'profile',
        label: 'Profile',
        icon: 'FiUser',
        fields: [
          { name: 'name', label: 'Full Name', type: 'text' },
          { name: 'title', label: 'Professional Title', type: 'text' },
          { name: 'email', label: 'Email', type: 'email' },
          { name: 'location', label: 'Location', type: 'text' },
          { name: 'linkedin', label: 'LinkedIn', type: 'text' },
          { name: 'github', label: 'GitHub', type: 'text' },
          { name: 'twitter', label: 'Twitter/X', type: 'text' },
          { name: 'website', label: 'Website', type: 'text' },
        ]
      },
      {
        id: 'summary',
        label: 'Executive Summary',
        icon: 'FiMessageSquare',
        fields: [
          { name: 'summary', label: 'Summary', type: 'textarea' }
        ]
      },
      {
        id: 'experience',
        label: 'Work Experience',
        icon: 'FiBriefcase',
        type: 'list',
        name: 'experience',
        fields: [
          { name: 'role', label: 'Position', type: 'text' },
          { name: 'company', label: 'Company', type: 'text' },
          { name: 'duration', label: 'Tenure', type: 'text' },
          { name: 'description', label: 'Responsibilities', type: 'textarea' }
        ]
      }
    ]
  }
};
