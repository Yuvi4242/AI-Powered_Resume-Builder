import React, { useState, useEffect, useRef } from 'react';
import { 
  FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiGlobe, 
  FiBriefcase, FiBook, FiCpu, FiLayers, FiLink, FiSettings, 
  FiImage, FiPlus, FiTrash2, FiCheck, FiAlertCircle, FiChevronRight,
  FiZap, FiAward, FiGithub, FiLinkedin, FiExternalLink, FiLoader,
  FiDollarSign, FiClock, FiCheckCircle
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { profileAPI, resumeAI, BASE_URL } from '../utils/api';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import TagInput from '../components/ui/TagInput';

const Profile = () => {
  // 1. STATE MANAGEMENT
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    address: "",
    headline: "",
    currentRole: "",
    experienceLevel: "",
    industry: "",
    careerObjective: "",
    preferredJobRole: "",
    preferredLocation: "",
    expectedSalary: "",
    highestQualification: "",
    collegeName: "",
    degree: "",
    branch: "",
    graduationYear: "",
    tenthScore: "",
    twelfthScore: "",
    certifications: "",
    technicalSkills: [],
    softSkills: [],
    toolsTechnologies: [],
    languagesKnown: [],
    experiences: [],
    projects: [],
    linkedin: "",
    github: "",
    portfolio: "",
    leetcode: "",
    hackerrank: "",
    otherLink: "",
    resumeTemplate: "Modern",
    themeColor: "#3b82f6",
    fontStyle: "Inter",
    careerFocus: "",
    resumeLanguage: "English",
    jobTypePreference: "Remote",
    noticePeriod: "",
    relocation: false,
    profileImage: "",
    profileCompletion: 0
  });

  const [activeTab, setActiveTab] = useState('personal');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  // 1.0 COOLDOWN TIMER Logic
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // 1.1 AI GENERATION HANDLERS
  const handleAIGenerateSummary = async () => {
    if (cooldown > 0) return;
    setIsAIGenerating(true);
    setStatus({ type: 'info', message: 'Magic is happening... 🪄' });
    try {
      const response = await resumeAI.generateSummary({ ...profileData, type: 'generate' });
      if (response.data.success) {
        const content = response.data?.data?.content || response.data?.content || '';
        setProfileData(prev => ({ ...prev, careerObjective: content }));
        setStatus({ type: 'success', message: 'Summary generated with AI!' });
        setTimeout(() => setStatus({ type: '', message: '' }), 3000);
      }
    } catch (error) {
      console.error('AI Summary Error:', error);
      if (error.response?.status === 429) {
        setCooldown(20);
        setStatus({ type: 'error', message: 'Rate limit hit. Pausing for 20 seconds.' });
      } else {
        setStatus({ type: 'error', message: 'AI generation failed. Please try again.' });
      }
    } finally {
      setIsAIGenerating(false);
    }
  };

  const handleAIGenerateExperience = async (index) => {
    if (cooldown > 0) return;
    const exp = profileData.experiences[index];
    if (!exp.role) {
      setStatus({ type: 'error', message: 'Please provide a role title first.' });
      return;
    }

    setIsAIGenerating(true);
    setStatus({ type: 'info', message: 'Optimizing your impact... 🚀' });
    try {
      // For experience, we'll use the optimization logic
      const response = await resumeAI.optimizeForJD(
        [exp.description || ''], 
        `Role: ${exp.role}`
      );
      if (response.data.success) {
        const content = response.data?.data?.content || response.data?.content || '';
        const updated = [...profileData.experiences];
        updated[index].description = Array.isArray(content) ? content.join('\n') : content;
        setProfileData(prev => ({ ...prev, experiences: updated }));
        setStatus({ type: 'success', message: 'Experience optimized with AI!' });
        setTimeout(() => setStatus({ type: '', message: '' }), 3000);
      }
    } catch (error) {
      console.error('AI Experience Error:', error);
      if (error.response?.status === 429) {
        setCooldown(20);
        setStatus({ type: 'error', message: 'Rate limit hit. Pausing for 20 seconds.' });
      } else {
        setStatus({ type: 'error', message: 'AI optimization failed.' });
      }
    } finally {
      setIsAIGenerating(false);
    }
  };

  // 2. DATA FETCHING
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profileAPI.getProfile();
        if (response.data.success) {
          setProfileData(prev => ({ ...prev, ...response.data.profile }));
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setStatus({ type: 'error', message: 'Failed to load profile data.' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // 3. HANDLERS
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setStatus({ type: 'info', message: 'Saving changes...' });

    try {
      const response = await profileAPI.updateProfile(profileData);
      if (response.data.success) {
        setProfileData(response.data.profile);
        setStatus({ type: 'success', message: 'Profile updated successfully!' });
        setTimeout(() => setStatus({ type: '', message: '' }), 3000);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setStatus({ type: 'error', message: 'Failed to save changes. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Local preview
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);

    // Upload to server
    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      setIsSaving(true);
      const response = await profileAPI.uploadProfilePhoto(formData);
      if (response.data.success) {
        setProfileData(prev => ({ 
          ...prev, 
          profileImage: response.data.profileImage,
          profileCompletion: response.data.profileCompletion 
        }));
        setStatus({ type: 'success', message: 'Photo uploaded successfully!' });
      }
    } catch (error) {
      console.error('Image upload error:', error);
      setStatus({ type: 'error', message: 'Failed to upload photo.' });
    } finally {
      setIsSaving(false);
    }
  };

  // 4. DYNAMIC LIST HELPERS
  const addExperience = () => {
    setProfileData(prev => ({
      ...prev,
      experiences: [...prev.experiences, { companyName: '', role: '', duration: '', employmentType: 'Full-time', description: '' }]
    }));
  };

  const removeExperience = (index) => {
    setProfileData(prev => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index)
    }));
  };

  const updateExperience = (index, field, value) => {
    const updated = [...profileData.experiences];
    updated[index][field] = value;
    setProfileData(prev => ({ ...prev, experiences: updated }));
  };

  const addProject = () => {
    setProfileData(prev => ({
      ...prev,
      projects: [...prev.projects, { title: '', techStack: '', description: '', githubLink: '', liveLink: '' }]
    }));
  };

  const removeProject = (index) => {
    setProfileData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const updateProject = (index, field, value) => {
    const updated = [...profileData.projects];
    updated[index][field] = value;
    setProfileData(prev => ({ ...prev, projects: updated }));
  };

  // 5. RENDER HELPERS
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <FiLoader className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Initializing your profile data...</p>
      </div>
    );
  }

  const tabs = [
    { id: 'personal', label: 'Personal', icon: <FiUser /> },
    { id: 'professional', label: 'Professional', icon: <FiBriefcase /> },
    { id: 'education', label: 'Education', icon: <FiBook /> },
    { id: 'skills', label: 'Skills', icon: <FiCpu /> },
    { id: 'experience', label: 'Experience', icon: <FiLayers /> },
    { id: 'projects', label: 'Projects', icon: <FiSettings /> },
    { id: 'social', label: 'Social', icon: <FiLink /> },
    { id: 'preferences', label: 'Preferences', icon: <FiAward /> }
  ];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full pb-24">
      
      {/* HEADER SECTION */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Profile Settings</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your comprehensive professional identity and resume preferences.</p>
        </div>
        <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle className="text-slate-100 dark:text-slate-700" strokeWidth="6" stroke="currentColor" fill="transparent" r="28" cx="32" cy="32" />
              <circle className="text-blue-500 transition-all duration-1000 ease-out" strokeWidth="6" strokeDasharray={176} strokeDashoffset={176 - (176 * profileData.profileCompletion) / 100} strokeLinecap="round" stroke="currentColor" fill="transparent" r="28" cx="32" cy="32" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-slate-900 dark:text-white">
              {profileData.profileCompletion}%
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Profile Strength</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {profileData.profileCompletion < 50 ? 'Needs Improvement' : profileData.profileCompletion < 80 ? 'Looking Good!' : 'Excellent Profile!'}
            </p>
          </div>
        </div>
      </div>

      {status.message && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className={`mb-8 p-4 rounded-2xl flex items-center gap-3 font-semibold ${
            status.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 
            status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
            'bg-blue-50 text-blue-600 border border-blue-100'
          }`}
        >
          {status.type === 'error' ? <FiAlertCircle /> : status.type === 'success' ? <FiCheckCircle /> : <FiLoader className="animate-spin" />}
          {status.message}
        </motion.div>
      )}

      {cooldown > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 p-6 bg-amber-50 border-2 border-amber-200 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center text-amber-700">
               <FiClock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <p className="text-amber-900 font-black text-lg">AI Engine Cool-down active</p>
              <p className="text-amber-700 text-sm font-medium">We're hitting the free tier limit. Service will resume shortly.</p>
            </div>
          </div>
          <div className="bg-amber-900 text-white px-6 py-3 rounded-2xl font-black text-2xl shadow-xl shadow-amber-900/20">
            {cooldown}s
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SIDEBAR NAVIGATION */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
            
            <div className="relative mb-6 flex flex-col items-center">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-slate-700 shadow-xl group-hover:scale-105 transition-transform duration-300">
                  {previewImage || profileData.profileImage ? (
                    <img 
                      src={previewImage || (profileData.profileImage?.startsWith('http') ? profileData.profileImage : `${BASE_URL}${profileData.profileImage}`)} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                      <FiUser className="w-10 h-10 text-slate-300" />
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 right-0 p-2 bg-blue-500 text-white rounded-full shadow-lg border-2 border-white dark:border-slate-800 transform translate-x-1 translate-y-1">
                  <FiImage className="w-3 h-3" />
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} hidden accept="image/*" />
              </div>
              <h3 className="mt-4 font-black text-slate-900 dark:text-white text-lg">{profileData.fullName || 'New User'}</h3>
              <p className="text-xs font-bold text-blue-500 uppercase mt-1 line-clamp-1">{profileData.currentRole || 'Awaiting Role'}</p>
            </div>

            <div className="space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                    activeTab === tab.id 
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  {tab.label}
                  {activeTab === tab.id && <FiChevronRight className="ml-auto" />}
                </button>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="w-full h-14 rounded-2xl bg-slate-900 text-white hover:bg-black shadow-xl shadow-slate-900/20 gap-3 font-black text-lg"
          >
            {isSaving ? <FiLoader className="animate-spin" /> : <FiCheck />}
            Save Changes
          </Button>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 lg:p-10 border border-slate-100 dark:border-slate-700 shadow-sm min-h-[600px]"
            >
              
              {/* 1. PERSONAL INFORMATION */}
              {activeTab === 'personal' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 text-xl font-bold">
                      <FiUser />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white">Personal Information</h2>
                      <p className="text-sm text-slate-500 italic">Essential details to identify you perfectly.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Full Name" name="fullName" value={profileData.fullName} onChange={handleInputChange} placeholder="John Doe" />
                    <Input label="Email Address" name="email" value={profileData.email} onChange={handleInputChange} placeholder="john@example.com" />
                    <Input label="Phone Number" name="phone" value={profileData.phone} onChange={handleInputChange} placeholder="+91 XXXXX XXXXX" />
                    <Input label="Date of Birth" name="dateOfBirth" type="date" value={profileData.dateOfBirth} onChange={handleInputChange} />
                    
                    <div className="space-y-2">
                       <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Gender</label>
                       <select 
                        name="gender" 
                        value={profileData.gender} 
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium"
                       >
                         <option value="">Select Gender</option>
                         <option value="Male">Male</option>
                         <option value="Female">Female</option>
                         <option value="Other">Other</option>
                       </select>
                    </div>

                    <Input label="City" name="city" value={profileData.city} onChange={handleInputChange} placeholder="Mumbai" />
                    <Input label="State" name="state" value={profileData.state} onChange={handleInputChange} placeholder="Maharashtra" />
                    <Input label="Country" name="country" value={profileData.country} onChange={handleInputChange} placeholder="India" />
                    <Input label="Pincode" name="pincode" value={profileData.pincode} onChange={handleInputChange} placeholder="400001" />
                    
                    <div className="md:col-span-2 space-y-2">
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Address / Location</label>
                      <textarea
                        name="address"
                        value={profileData.address}
                        onChange={handleInputChange}
                        placeholder="Street, locality, landmark..."
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm h-24 resize-none"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="block text-sm font-bold  text-blue-600 uppercase tracking-tighter">Professional Headline</label>
                      <input
                        type="text"
                        name="headline"
                        value={profileData.headline}
                        onChange={handleInputChange}
                        placeholder="e.g. Passionate Full Stack Developer | React & Node.js Expert"
                        className="w-full px-5 py-4 bg-blue-50/30 dark:bg-blue-900/10 border-2 border-blue-500/20 dark:border-blue-500/10 rounded-2xl outline-none focus:border-blue-500 font-bold text-slate-900 dark:text-white transition-all shadow-inner"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 2. PROFESSIONAL INFORMATION */}
              {activeTab === 'professional' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 text-xl font-bold">
                      <FiBriefcase />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white">Professional Information</h2>
                      <p className="text-sm text-slate-500 italic">Describe your current career status and goals.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Current Role / Job Title" name="currentRole" value={profileData.currentRole} onChange={handleInputChange} placeholder="Senior Frontend Developer" />
                    
                    <div className="space-y-2">
                       <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Experience Level</label>
                       <select 
                        name="experienceLevel" 
                        value={profileData.experienceLevel} 
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                       >
                         <option value="">Select Level</option>
                         <option value="Fresher">Fresher / Student</option>
                         <option value="Junior">Junior (1-2 years)</option>
                         <option value="Intermediate">Intermediate (3-5 years)</option>
                         <option value="Senior">Senior (5-10 years)</option>
                         <option value="Executive">Expert / Executive (10+ years)</option>
                       </select>
                    </div>

                    <Input label="Industry" name="industry" value={profileData.industry} onChange={handleInputChange} placeholder="Information Technology" />
                    <Input label="Expected Salary" name="expectedSalary" value={profileData.expectedSalary} onChange={handleInputChange} placeholder="e.g. 12 LPA" />
                    <Input label="Preferred Job Role" name="preferredJobRole" value={profileData.preferredJobRole} onChange={handleInputChange} placeholder="React Developer" />
                    <Input label="Preferred Location" name="preferredLocation" value={profileData.preferredLocation} onChange={handleInputChange} placeholder="Remote / Bengaluru" />

                    <div className="md:col-span-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Career Objective / About Me</label>
                        <button 
                          onClick={handleAIGenerateSummary}
                          disabled={isAIGenerating || cooldown > 0}
                          className={`flex items-center gap-1.5 px-3 py-1 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                            cooldown > 0 ? 'bg-slate-400 opacity-50' : 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95'
                          }`}
                        >
                          <FiZap className="fill-white" />
                          {cooldown > 0 ? `Wait ${cooldown}s` : isAIGenerating ? 'Magic...' : 'Generate with AI'}
                        </button>
                      </div>
                      <textarea
                        name="careerObjective"
                        value={profileData.careerObjective}
                        onChange={handleInputChange}
                        placeholder="Briefly describe your career journey and aspirations..."
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm h-40"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 3. EDUCATION DETAILS */}
              {activeTab === 'education' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 text-xl font-bold">
                      <FiBook />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white">Education Details</h2>
                      <p className="text-sm text-slate-500 italic">Your academic background and certifications.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Highest Qualification</label>
                       <select 
                        name="highestQualification" 
                        value={profileData.highestQualification} 
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                       >
                         <option value="">Select Qualification</option>
                         <option value="Undergraduate">Undergraduate (Bachelor's)</option>
                         <option value="Graduate">Graduate (Master's)</option>
                         <option value="Postgraduate">Postgraduate / PhD</option>
                         <option value="Diploma">Diploma</option>
                         <option value="Schooling">12th / Schooling</option>
                       </select>
                    </div>

                    <Input label="College / University Name" name="collegeName" value={profileData.collegeName} onChange={handleInputChange} placeholder="IIT Bombay" />
                    <Input label="Degree Title" name="degree" value={profileData.degree} onChange={handleInputChange} placeholder="B.Tech" />
                    <Input label="Branch / Stream" name="branch" value={profileData.branch} onChange={handleInputChange} placeholder="Computer Science" />
                    <Input label="Graduation Year" name="graduationYear" value={profileData.graduationYear} onChange={handleInputChange} placeholder="2024" />
                    <Input label="10th Score (% / CGPA)" name="tenthScore" value={profileData.tenthScore} onChange={handleInputChange} placeholder="9.5 CGPA" />
                    <Input label="12th Score (% / CGPA)" name="twelfthScore" value={profileData.twelfthScore} onChange={handleInputChange} placeholder="92%" />
                    
                    <div className="md:col-span-2 space-y-2">
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Certifications (Comma separated)</label>
                      <textarea
                        name="certifications"
                        value={profileData.certifications}
                        onChange={handleInputChange}
                        placeholder="AWS Certified Developer, Meta React Course, etc."
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm h-24"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 4. SKILLS SECTION */}
              {activeTab === 'skills' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-500 text-xl font-bold">
                      <FiCpu />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white">Skills & Technologies</h2>
                      <p className="text-sm text-slate-500 italic">Highlight your technical and soft powers. Press Enter to add tags.</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <TagInput 
                      label="Technical Skills"
                      tags={profileData.technicalSkills} 
                      setTags={(tags) => handleArrayChange('technicalSkills', tags)} 
                      placeholder="Type skill & press Enter (e.g. React, Node.js)" 
                    />
                    
                    <TagInput 
                      label="Soft Skills"
                      tags={profileData.softSkills} 
                      setTags={(tags) => handleArrayChange('softSkills', tags)} 
                      placeholder="e.g. Leadership, Communication, Problem Solving" 
                    />

                    <TagInput 
                      label="Tools & Technologies"
                      tags={profileData.toolsTechnologies} 
                      setTags={(tags) => handleArrayChange('toolsTechnologies', tags)} 
                      placeholder="e.g. VS Code, Docker, Jenkins, Git" 
                    />

                    <TagInput 
                      label="Languages Known"
                      tags={profileData.languagesKnown} 
                      setTags={(tags) => handleArrayChange('languagesKnown', tags)} 
                      placeholder="e.g. English, Hindi, Spanish" 
                    />
                  </div>
                </div>
              )}

              {/* 5. EXPERIENCE SECTION */}
              {activeTab === 'experience' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 text-xl font-bold">
                        <FiLayers />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Work Experience</h2>
                        <p className="text-sm text-slate-500 italic">Your professional journey and achievements.</p>
                      </div>
                    </div>
                    <Button onClick={addExperience} variant="outline" className="gap-2 border-emerald-500/20 text-emerald-600 hover:bg-emerald-50 rounded-2xl font-bold">
                      <FiPlus /> Add Role
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {profileData.experiences.length === 0 ? (
                      <div className="text-center py-20 border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-3xl">
                        <FiBriefcase className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 font-medium">No experience added yet. Add your first career milestone!</p>
                      </div>
                    ) : (
                      profileData.experiences.map((exp, idx) => (
                        <div key={idx} className="bg-slate-50 dark:bg-slate-900/30 rounded-3xl p-6 relative border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                          <button 
                            onClick={() => removeExperience(idx)}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <FiTrash2 />
                          </button>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Company Name" value={exp.companyName} onChange={(e) => updateExperience(idx, 'companyName', e.target.value)} />
                            <Input label="Role" value={exp.role} onChange={(e) => updateExperience(idx, 'role', e.target.value)} />
                            <Input label="Duration" placeholder="e.g Jan 2022 - Present" value={exp.duration} onChange={(e) => updateExperience(idx, 'duration', e.target.value)} />
                            
                            <div className="space-y-2">
                              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Employment Type</label>
                              <select 
                                value={exp.employmentType} 
                                onChange={(e) => updateExperience(idx, 'employmentType', e.target.value)}
                                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                              >
                                <option value="Full-time">Full-time</option>
                                <option value="Internship">Internship</option>
                                <option value="Freelance">Freelance</option>
                                <option value="Contract">Contract</option>
                              </select>
                            </div>
                            
                            <div className="md:col-span-2 space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Description / Highlights</label>
                                <button 
                                  onClick={() => handleAIGenerateExperience(idx)}
                                  disabled={isAIGenerating || cooldown > 0}
                                  className={`flex items-center gap-1.5 px-3 py-1 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                    cooldown > 0 ? 'bg-slate-400 opacity-50' : 'bg-emerald-500 shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95'
                                  }`}
                                >
                                  <FiZap className="fill-white" />
                                  {cooldown > 0 ? `Wait ${cooldown}s` : isAIGenerating ? 'Magic...' : 'Optimize with AI'}
                                </button>
                              </div>
                              <textarea
                                value={exp.description}
                                onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                                placeholder="Describe your responsibilities and impact..."
                                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm h-24"
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* 6. PROJECTS SECTION */}
              {activeTab === 'projects' && ( activeTab === 'projects' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-cyan-50 rounded-2xl flex items-center justify-center text-cyan-500 text-xl font-bold">
                        <FiSettings />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Personal Projects</h2>
                        <p className="text-sm text-slate-500 italic">Showcase your practical skills through projects.</p>
                      </div>
                    </div>
                    <Button onClick={addProject} variant="outline" className="gap-2 border-cyan-500/20 text-cyan-600 hover:bg-cyan-50 rounded-2xl font-bold">
                      <FiPlus /> Add Project
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {profileData.projects.length === 0 ? (
                      <div className="text-center py-20 border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-3xl">
                        <FiCpu className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 font-medium">No projects added yet. Share something cool you built!</p>
                      </div>
                    ) : (
                      profileData.projects.map((proj, idx) => (
                        <div key={idx} className="bg-slate-50 dark:bg-slate-900/30 rounded-3xl p-6 relative border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                          <button 
                            onClick={() => removeProject(idx)}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <FiTrash2 />
                          </button>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Project Title" value={proj.title} onChange={(e) => updateProject(idx, 'title', e.target.value)} />
                            <Input label="Tech Stack" value={proj.techStack} onChange={(e) => updateProject(idx, 'techStack', e.target.value)} />
                            <div className="md:col-span-2 space-y-2">
                              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Description</label>
                              <textarea
                                value={proj.description}
                                onChange={(e) => updateProject(idx, 'description', e.target.value)}
                                placeholder="What problem does this project solve? What was your role?"
                                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm h-24"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4 md:col-span-2">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-slate-400 px-1">GitHub Link</label>
                                    <div className="relative group">
                                        <FiGithub className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input 
                                            value={proj.githubLink} 
                                            onChange={(e) => updateProject(idx, 'githubLink', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm"
                                            placeholder="https://github.com/..." 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-slate-400 px-1">Live Demo</label>
                                    <div className="relative group">
                                        <FiExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input 
                                            value={proj.liveLink} 
                                            onChange={(e) => updateProject(idx, 'liveLink', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm"
                                            placeholder="https://myproject.com" 
                                        />
                                    </div>
                                </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}

              {/* 7. SOCIAL LINKS */}
              {activeTab === 'social' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 text-xl font-bold">
                      <FiLink />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white">Social & Professional Links</h2>
                      <p className="text-sm text-slate-500 italic">Where can recruiters find your online proof of work?</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                        <FiLinkedin className="text-blue-600" /> LinkedIn URL
                      </label>
                      <Input name="linkedin" value={profileData.linkedin} onChange={handleInputChange} placeholder="linkedin.com/in/username" />
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                        <FiGithub className="text-slate-900 dark:text-white" /> GitHub URL
                      </label>
                      <Input name="github" value={profileData.github} onChange={handleInputChange} placeholder="github.com/username" />
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                        <FiGlobe className="text-emerald-500" /> Portfolio Website
                      </label>
                      <Input name="portfolio" value={profileData.portfolio} onChange={handleInputChange} placeholder="https://myname.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                        <FiExternalLink className="text-orange-500" /> LeetCode URL
                      </label>
                      <Input name="leetcode" value={profileData.leetcode} onChange={handleInputChange} placeholder="leetcode.com/username" />
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                        <FiAward className="text-red-500" /> HackerRank URL
                      </label>
                      <Input name="hackerrank" value={profileData.hackerrank} onChange={handleInputChange} placeholder="hackerrank.com/username" />
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                        <FiCheckCircle className="text-indigo-500" /> Other Portfolio/Link
                      </label>
                      <Input name="otherLink" value={profileData.otherLink} onChange={handleInputChange} placeholder="Behance, Dribbble, etc." />
                    </div>
                  </div>
                </div>
              )}

              {/* 8. RESUME PREFERENCES */}
              {activeTab === 'preferences' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 text-xl font-bold">
                      <FiAward />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white">Resume Preferences</h2>
                      <p className="text-sm text-slate-500 italic">Default settings for your future AI-generated resumes.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Preferred Resume Template</label>
                        <select 
                          name="resumeTemplate" 
                          value={profileData.resumeTemplate} 
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                        >
                          <option value="Modern">Modern Minimalist</option>
                          <option value="Executive">Executive Professional</option>
                          <option value="Creative">Creative Bold</option>
                          <option value="Classic">Classic ATS</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Theme Primary Color</label>
                        <div className="flex items-center gap-4">
                            <input 
                                type="color" 
                                name="themeColor" 
                                value={profileData.themeColor} 
                                onChange={handleInputChange}
                                className="w-12 h-12 rounded-xl cursor-pointer border-none bg-transparent"
                            />
                            <span className="text-sm font-bold font-mono text-slate-500">{profileData.themeColor}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Default Resume Language</label>
                        <select 
                          name="resumeLanguage" 
                          value={profileData.resumeLanguage} 
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                        >
                          <option value="English">English</option>
                          <option value="Hindi">Hindi</option>
                          <option value="Spanish">Spanish</option>
                          <option value="German">German</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Job Type Preference</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['Remote', 'Onsite', 'Hybrid'].map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setProfileData(prev => ({ ...prev, jobTypePreference: type }))}
                                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                                        profileData.jobTypePreference === type 
                                        ? 'bg-blue-500 text-white border-blue-500 shadow-md' 
                                        : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'
                                    }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                      </div>

                      <Input label="Notice Period (days)" name="noticePeriod" value={profileData.noticePeriod} onChange={handleInputChange} placeholder="e.g. 30" />

                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">Open to Relocation</p>
                            <p className="text-xs text-slate-500">Willing to move for the right opportunity?</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                name="relocation" 
                                checked={profileData.relocation} 
                                onChange={handleInputChange} 
                                className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {/* GLOBAL SAVE STICKY BUTTON (MOBILE) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:hidden z-50">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="w-full h-16 rounded-3xl bg-slate-900 text-white shadow-2xl shadow-slate-900/40 gap-3 font-black text-lg"
          >
            {isSaving ? <FiLoader className="animate-spin" /> : <FiCheck />}
            {isSaving ? 'Saving...' : 'Save Profile'}
          </Button>
      </div>
    </div>
  );
};

export default Profile;
