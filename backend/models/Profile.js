const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  companyName: String,
  role: String,
  duration: String,
  employmentType: {
    type: String,
    enum: ['Full-time', 'Internship', 'Freelance', 'Contract', ''],
    default: ''
  },
  description: String
});

const projectSchema = new mongoose.Schema({
  title: String,
  techStack: String,
  description: String,
  githubLink: String,
  liveLink: String
});

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // 1) PERSONAL INFORMATION
  fullName: String,
  email: String,
  phone: String,
  dateOfBirth: String,
  gender: String,
  city: String,
  state: String,
  country: String,
  pincode: String,
  address: String,
  headline: String,

  // 2) PROFESSIONAL INFORMATION
  currentRole: String,
  experienceLevel: String,
  industry: String,
  careerObjective: String,
  preferredJobRole: String,
  preferredLocation: String,
  expectedSalary: String,

  // 3) EDUCATION DETAILS
  highestQualification: String,
  collegeName: String,
  degree: String,
  branch: String,
  graduationYear: String,
  tenthScore: String,
  twelfthScore: String,
  certifications: String,

  // 4) SKILLS
  technicalSkills: [String],
  softSkills: [String],
  toolsTechnologies: [String],
  languagesKnown: [String],

  // 5) EXPERIENCE & PROJECTS
  experiences: [experienceSchema],
  projects: [projectSchema],

  // 7) SOCIAL LINKS
  linkedin: String,
  github: String,
  portfolio: String,
  leetcode: String,
  hackerrank: String,
  codechef: String,
  twitter: String,
  behance: String,
  dribbble: String,
  medium: String,
  website: String,
  otherLink: String,

  // 8) RESUME PREFERENCES
  resumeTemplate: String,
  themeColor: String,
  fontStyle: String,
  careerFocus: String,
  resumeLanguage: String,
  jobTypePreference: String,
  noticePeriod: String,
  relocation: {
    type: Boolean,
    default: false
  },

  // 9) PROFILE PHOTO
  profileImage: String,

  profileCompletion: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
