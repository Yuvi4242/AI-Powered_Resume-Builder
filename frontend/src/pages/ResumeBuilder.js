import { AnimatePresence, motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useEffect, useRef, useState } from 'react';
import {
  FiAlertCircle, FiAward, FiBookOpen, FiBriefcase, FiCheck,
  FiDownload, FiImage, FiMail, FiPhone, FiSave, FiUpload,
  FiUser, FiX, FiZap, FiLayout, FiShare2, FiCornerUpLeft, FiCornerUpRight, FiMoreHorizontal,
  FiFileText, FiMessageSquare, FiSliders, FiChevronDown, FiPlus, FiInfo, FiGlobe
} from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { aiAPI, resumeAPI } from '../utils/api';
import { templatesData } from '../data/templatesData';
import { templateSchemas } from '../data/templateSchemas';
import TemplateRenderer from '../components/TemplateRenderer';
import DynamicForm from '../components/Sidebar/DynamicForm';

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editResume = location.state?.resume;
  const resumePreviewRef = useRef(null);

  const [selectedTemplate, setSelectedTemplate] = useState('template1');
  const [activeTab, setActiveTab] = useState('profile'); // profile, summary, experience, education, skills
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: 'Jane Doe', email: 'jane@example.com', phone: '+1 234 567 8900', skills: 'React, Node.js, AI Integration, Product Strategy', experience: 'Senior Product Manager at TechFlow (2022 - Present)\n- Led deployment of AI core features\n- Increased user retention by 40%', education: 'B.S. Computer Science, Stanford University', summary: 'Senior Product Manager with a passion for designing scalable AI systems and elegant user experiences.',
  });

  const [aiMode, setAiMode] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [activeAIField, setActiveAIField] = useState(null); // Track which field is currently being assisted by AI
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const [jobTitle, setJobTitle] = useState('');
  const [bulletPoints, setBulletPoints] = useState([]);
  const [isGeneratingBullets, setIsGeneratingBullets] = useState(false);
  const [atsScore, setAtsScore] = useState(0);
  const [atsSuggestions, setAtsSuggestions] = useState([]);
  const [atsAnalysis, setAtsAnalysis] = useState(null);
  const [isCheckingATS, setIsCheckingATS] = useState(false);
  const [suggestedSkills, setSuggestedSkills] = useState([]);
  const [isSuggestingSkills, setIsSuggestingSkills] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(true);

  useEffect(() => {
    // Check if we are starting with a specific template from location state
    const templateFromState = location.state?.template;
    
    if (editResume) {
      setFormData({
        name: editResume.name || '',
        email: editResume.email || '',
        phone: editResume.phone || '',
        skills: editResume.skills || '',
        experience: editResume.experience || '',
        education: editResume.education || '',
        summary: editResume.summary || '',
        projects: editResume.projects || '',
        certifications: editResume.certifications || '',
        campaigns: editResume.campaigns || '',
        achievements: editResume.achievements || '',
        portfolio: editResume.portfolio || '',
        objective: editResume.objective || '',
        academic_projects: editResume.academic_projects || '',
        city: editResume.city || '',
        state: editResume.state || '',
        linkedin: editResume.linkedin || '',
        github: editResume.github || '',
        internships: editResume.internships || '',
        technical_skills: editResume.technical_skills || '',
      });
      setSelectedTemplate(editResume.template || 'template1');
      if (editResume.photo) setPhotoPreview(editResume.photo);
    } else if (templateFromState) {
      setSelectedTemplate(templateFromState.id);
      setFormData({
        name: '', email: '', phone: '',
        ...templateFromState.sampleData
      });
    } else {
      // Default to template1 sample data
      const defaultTemplate = templatesData.find(t => t.id === 'template1');
      setFormData(defaultTemplate.sampleData);
    }
  }, [editResume, location.state]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInlineEdit = (fieldPath, value) => {
    const keys = fieldPath.split('.');
    setFormData(prev => {
      const newData = { ...prev };
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (Array.isArray(current[key])) {
          current[key] = [...current[key]];
        } else if (current[key] && typeof current[key] === 'object') {
          current[key] = { ...current[key] };
        }
        current = current[key];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  // ── AI COPILOT SYNC (Custom Event Communication) ──────────────────────────
  useEffect(() => {
    const handleGetResumeData = () => {
      window.dispatchEvent(new CustomEvent('RESUME_DATA_RESPONSE', { detail: formData }));
    };

    const handleApplyContent = (e) => {
      const { field, content, action } = e.detail;
      if (!field || !content) return;

      setFormData(prev => {
        const newData = { ...prev };
        
        // 1. Special Case: Adding a skill (Append)
        if (action === 'ADD_SKILL' || field === 'skills') {
          const currentSkills = prev.skills || '';
          if (!currentSkills.toLowerCase().includes(content.toLowerCase())) {
            newData.skills = currentSkills ? `${currentSkills}, ${content}` : content;
          }
          return newData;
        }

        // 2. Specialized list sections (Experience, Projects, etc.)
        if (['experience', 'projects', 'academic_projects', 'internships'].includes(field)) {
          if (typeof prev[field] === 'string') {
            newData[field] = content;
          } else {
            const list = Array.isArray(prev[field]) ? [...prev[field]] : [];
            if (list.length > 0) {
              // Update the first/active entry
              list[0] = { ...list[0], description: content };
            } else {
              // Create a default entry if list is empty
              list.push({ title: 'New Entry', description: content });
            }
            newData[field] = list;
          }
        } else {
          // 3. Standard string fields (summary, objective, etc.)
          newData[field] = content;
        }
        
        return newData;
      });

      setSuccessMessage(`Maine aapka ${field} update kar diya hai!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    };

    window.addEventListener('GET_RESUME_DATA', handleGetResumeData);
    window.addEventListener('APPLY_AI_CONTENT', handleApplyContent);
    window.addEventListener('TRIGGER_ATS_SCAN', handleCheckATS);
    
    return () => {
      window.removeEventListener('GET_RESUME_DATA', handleGetResumeData);
      window.removeEventListener('APPLY_AI_CONTENT', handleApplyContent);
      window.removeEventListener('TRIGGER_ATS_SCAN', handleCheckATS);
    };
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(name, value);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) { setError('Please select an image file'); return; }
      if (file.size > 5 * 1024 * 1024) { setError('Image must be less than 5MB'); return; }
      setPhoto(file); setPhotoPreview(URL.createObjectURL(file)); setError('');
    }
  };

  const removePhoto = () => { setPhoto(null); setPhotoPreview(null); };

  const executeDownload = async (type) => {
    if (!resumePreviewRef.current) return;
    setIsDownloading(true); setError(''); setSuccessMessage('');
    try {
      const element = resumePreviewRef.current;
      const originalTransform = element.style.transform;
      element.style.transform = 'scale(1)';
      await new Promise(resolve => setTimeout(resolve, 100)); // allow DOM refresh
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      element.style.transform = originalTransform;

      if (type === 'pdf') {
        // Toggle to preview mode temporarily to hide editing UI
        const wasEditing = isEditingMode;
        setIsEditingMode(false);
        
        // Brief delay to allow React to re-render without editing indicators
        setTimeout(() => {
          window.print();
          // Restore previous mode
          setIsEditingMode(wasEditing);
          setIsDownloading(false);
          setSuccessMessage('PDF export triggered via browser print.');
        }, 500);
        return; // Early return for PDF as it's asynchronous via print dialog
      } else {
        const link = document.createElement('a');
        link.download = `${formData.name || 'document'}.${type}`;
        link.href = canvas.toDataURL(`image/${type === 'jpg' ? 'jpeg' : 'png'}`, 0.9);
        link.click();
      }
      setSuccessMessage(`Resume exported as ${type.toUpperCase()}!`);
    } catch (err) { setError(`Failed to download ${type}.`); }
    finally { setIsDownloading(false); }
  };

  const handleFieldAI = async (fieldName, action = 'generate') => {
    setActiveAIField(fieldName);
    if (fieldName === 'summary') setIsGenerating(true);
    setError('');
    
    try {
      let response;
      const currentText = formData[fieldName] || '';
      
      switch (fieldName) {
        case 'summary':
          response = await aiAPI.generateSummary({ ...formData, type: currentText ? 'improve' : 'generate' });
          break;
        case 'experience':
        case 'projects':
        case 'achievements':
          response = await aiAPI.generate('text-tool', { text: currentText, type: 'impact' });
          break;
        case 'skills':
          response = await aiAPI.suggestSkills({ role: formData.currentRole || formData.jobTitle || 'Professional' });
          break;
        default:
          response = await aiAPI.processText(currentText, 'professional');
      }

      if (response.data.success) {
        const content = response.data?.data?.content || response.data?.content || '';
        const mode = response.data?.data?.source || response.data?.provider || 'AI';
        setAiMode(mode);
        if (content) {
          setFormData(prev => ({ ...prev, [fieldName]: content }));
          setSuccessMessage(`${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} updated by AI!`);
          setTimeout(() => setSuccessMessage(''), 3000);
        }
      }
    } catch (err) {
      console.error(`AI Assist Error for ${fieldName}:`, err);
      setError(`AI could not process ${fieldName}. Please try again.`);
    } finally {
      setActiveAIField(null);
      if (fieldName === 'summary') setIsGenerating(false);
    }
  };

  const handleGenerateSummary = async () => {
    handleFieldAI('summary');
  };

  const handleCheckATS = async () => {
    setIsCheckingATS(true); setError(''); setSuccessMessage('');
    try {
      const response = await aiAPI.generate('ats', { resumeText: JSON.stringify(formData) });
      const result = response.data?.data || response.data;
      
      if (result) {
        setAtsScore(result.score || 0);
        setAtsSuggestions(result.suggestions || []);
        setAtsAnalysis(result); // Extra state for detailed breakdown
        setSuccessMessage('Deep ATS Analysis complete!');
      }
    } catch (err) {
      setError('ATS Analysis failed. Please try again.');
    } finally { setIsCheckingATS(false); }
  };

  const handleSuggestSkills = async () => {
    if (!jobTitle) { setError('Please enter a job title first'); return; }
    console.log("Calling AI API (Skills)...", jobTitle);
    setIsSuggestingSkills(true); setError('');
    try {
      const response = await aiAPI.suggestSkills({ role: jobTitle });
      console.log("AI Skills Response:", response.data);
      if (response.data.success) {
        const content = response.data?.data?.content ?? response.data?.content ?? '';
        // If it's a list, we might need to parse it, but for now we assume it's a string or handled by the backend
        const skills = typeof content === 'string' ? content : JSON.stringify(content);
        setSuggestedSkills(skills.split(',').map(s => s.trim()));
      }
    } catch (err) {
      setError('Failed to suggest skills.');
    } finally { setIsSuggestingSkills(false); }
  };

  const handleGenerateBulletPoints = async () => {
    if (!jobTitle) { setError('Please enter a target role first'); return; }
    console.log("Calling AI API (Bullet Points)...", jobTitle);
    setIsGeneratingBullets(true);
    try {
      const response = await aiAPI.generateBullets({ jobTitle });
      console.log("AI Bullet Points Response:", response.data);
      if (response.data.success) {
        const content = response.data?.data?.content ?? response.data?.content ?? '';
        const points = typeof content === 'string' ? content.split('\n').map(p => p.replace(/^- /, '').trim()) : content;
        setBulletPoints(Array.isArray(points) ? points : []);
      }
    } catch (err) { 
      setBulletPoints([
        "Spearheaded critical migration deploying scalable serverless functions cutting latency by 35%.",
        "Collaborated natively across 4 product disciplines aligning executive expectations.",
        "Authored stringent API endpoints securing downstream client processing loops."
      ]);
    }
    finally { setIsGeneratingBullets(false); }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) { setError('Please enter your basic info first'); return; }
    setIsSaving(true);
    try {
      const submitData = { ...formData, template: selectedTemplate, updatedAt: new Date().toISOString() };
      if (photoPreview && !photoPreview.startsWith('http')) submitData.photo = photoPreview;
      
      // Save to API
      const response = await resumeAPI.saveResume(submitData);
      
      // Save to localStorage (ensure Dashboard has real statistics)
      const localResumes = JSON.parse(localStorage.getItem('ai_resumes') || '[]');
      const existingIndex = localResumes.findIndex(r => r.name === submitData.name);
      
      if (existingIndex >= 0) {
        localResumes[existingIndex] = submitData;
      } else {
        localResumes.push({ ...submitData, _id: Date.now().toString() });
      }
      
      localStorage.setItem('ai_resumes', JSON.stringify(localResumes));

      if (response.data.success) {
        setSuccessMessage('Document saved securely in the cloud.');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) { 
      // Fallback: Still save to localStorage even if API fails
      const submitData = { ...formData, template: selectedTemplate, updatedAt: new Date().toISOString() };
      const localResumes = JSON.parse(localStorage.getItem('ai_resumes') || '[]');
      const existingIndex = localResumes.findIndex(r => r.name === submitData.name);
      if (existingIndex >= 0) {
        localResumes[existingIndex] = submitData;
      } else {
        localResumes.push({ ...submitData, _id: Date.now().toString() });
      }
      localStorage.setItem('ai_resumes', JSON.stringify(localResumes));
      
      setSuccessMessage('Saved locally (Offline Mode)');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
    finally { setIsSaving(false); }
  };

  const renderTemplate = () => {
    const templateConfig = templatesData.find(t => t.id === selectedTemplate) || templatesData[0];
    return (
      <TemplateRenderer 
        layoutType={templateConfig.layoutType} 
        data={formData} 
        isEditing={isEditingMode}
        onInlineEdit={handleInlineEdit}
      />
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden font-sans selection:bg-primary-100 selection:text-primary-900">
      
      {/* Top Universal Toolbar (SaaS abstraction) */}
      <header className="h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 shrink-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <FiLayout className="w-5 h-5" />
          </button>
          <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-2"></div>
          <p className="text-sm font-semibold truncate max-w-[150px] md:max-w-xs">{formData.name || 'Untitled Resume'} - Editor</p>
          <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
            Saved
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1 mr-4 border-r border-gray-200 dark:border-gray-700 pr-4">
            <button onClick={() => alert('Undo unavailable')} className="p-1.5 text-gray-400 hover:text-gray-900 rounded"><FiCornerUpLeft className="w-4 h-4" /></button>
            <button onClick={() => alert('Redo unavailable')} className="p-1.5 text-gray-400 hover:text-gray-900 rounded"><FiCornerUpRight className="w-4 h-4" /></button>
          </div>
          
          <div className="flex items-center bg-gray-100 dark:bg-gray-700/50 rounded-lg p-0.5 mr-2">
            <button 
              onClick={() => setIsEditingMode(true)}
              className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${isEditingMode ? 'bg-white dark:bg-gray-600 text-primary-600 shadow-sm' : 'text-gray-500'}`}
            >
              Edit Mode
            </button>
            <button 
              onClick={() => setIsEditingMode(false)}
              className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${!isEditingMode ? 'bg-white dark:bg-gray-600 text-primary-600 shadow-sm' : 'text-gray-500'}`}
            >
              Preview
            </button>
          </div>

          <Button variant="ghost" onClick={handleSubmit} className="gap-2 hidden sm:flex border border-transparent hover:border-gray-200" disabled={isSaving}>
            <FiSave className="w-4 h-4" /> {isSaving ? 'Saving' : 'Save'}
          </Button>
          <Button variant="secondary" className="gap-2" onClick={() => executeDownload('pdf')} disabled={isDownloading}>
            <FiDownload className="w-4 h-4" /> Export
          </Button>
          <Button variant="primary" onClick={() => alert('Share link copied!')} className="gap-2 shadow-primary-500/20 shadow-lg">
            <FiShare2 className="w-4 h-4" /> Share
          </Button>
        </div>
      </header>

      {/* Main 3 Column Layout Workspace */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* LEFT PANEL: Form Inputs */}
        <aside className="w-full md:w-[320px] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shrink-0 z-10 absolute md:static h-full transition-transform transform">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Content Sections</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            
            {/* Nav Tabs Logic implementation */}
            {/* Dynamic Form Content */}
            {(() => {
              const schema = templateSchemas[selectedTemplate];
              if (!schema) {
                return (
                  <div className="text-center p-8 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl">
                    <FiAlertCircle className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">No dynamic schema available</p>
                  </div>
                );
              }
              return (
                <DynamicForm 
                  schema={schema} 
                  formData={formData} 
                  onChange={handleChange} 
                  onAIAssist={handleFieldAI}
                  activeAIField={activeAIField}
                />
              );
            })()}

            <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Switch Template</p>
              <div className="grid grid-cols-2 gap-2">
                {templatesData.map(t => (
                  <button 
                    key={t.id}
                    onClick={() => {
                      setSelectedTemplate(t.id);
                      // Intelligently merge: Preserve existing data, only use sample if field is empty
                      setFormData(prev => {
                        const merged = { ...prev };
                        Object.keys(t.sampleData).forEach(key => {
                          const val = merged[key];
                          const isEmpty = !val || 
                            (typeof val === 'string' && val.trim() === '') || 
                            (Array.isArray(val) && val.length === 0);
                            
                          if (isEmpty) {
                            merged[key] = t.sampleData[key];
                          }
                        });
                        return merged;
                      });
                    }} 
                    className={`p-2 text-[10px] font-bold rounded truncate transition-all ${selectedTemplate === t.id ? 'bg-primary-600 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* CENTER PANEL: Live Resume WYSIWYG Canvas */}
        <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900/50 p-4 md:p-8 flex justify-center custom-scrollbar">
           
          {error && <div className="fixed top-20 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded shadow-lg flex items-center gap-2 text-sm font-medium"><FiAlertCircle />{error}</div>}
          {successMessage && <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded shadow-lg flex items-center gap-2 text-sm font-medium"><FiCheck />{successMessage}</div>}

          <div className="w-full max-w-[800px] bg-transparent flex flex-col items-center">
            {/* Scale Wrapper to ensure visually identical A4 ratio rendering independently of view port */}
            <div className="w-full bg-white shadow-2xl origin-top transition-transform resume-page-container min-h-[1056px] border border-gray-200" ref={resumePreviewRef}>
              {renderTemplate()}
            </div>
          </div>
        </main>

        {/* RIGHT PANEL: Integrated AI Copilot Sidebar */}
        <aside className="hidden xl:flex w-[320px] bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex-col shrink-0 z-10 h-full">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
            <FiZap className="text-accent-500" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">AI Copilot</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* ATS Metric Tooling */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ATS Scan</p>
                <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${atsScore > 75 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  {atsScore > 75 ? 'Good' : 'Needs Optimization'}
                </div>
              </div>
              
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path className="text-gray-200 dark:text-gray-700" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-primary-500" strokeWidth="3" strokeDasharray={`${atsScore}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-gray-900 dark:text-white leading-none">{atsScore || '--'}</span>
                  <span className="text-[10px] text-gray-500 font-bold">%</span>
                </div>
              </div>

              <Button variant="primary" onClick={handleCheckATS} disabled={isCheckingATS} className="w-full text-xs py-2 shadow-primary-500/20 font-bold">
                {isCheckingATS ? 'Analyzing...' : 'Deep Scan Now'}
              </Button>
              
              {atsAnalysis && (
                <div className="mt-6 space-y-4 text-left border-t border-gray-100 dark:border-gray-700 pt-4">
                  {/* Breakdown bars */}
                  <div className="space-y-2">
                    {Object.entries(atsAnalysis.breakdown || {}).map(([key, val]) => (
                      <div key={key}>
                        <div className="flex justify-between text-[10px] font-bold mb-1 uppercase text-gray-500">
                          <span>{key}</span>
                          <span>{val}</span>
                        </div>
                        <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-primary-500 transition-all duration-1000" style={{ width: `${(val / 25) * 100}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {atsAnalysis.missingKeywords?.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-red-500 uppercase mb-2">Missing Keywords:</p>
                      <div className="flex flex-wrap gap-1">
                        {atsAnalysis.missingKeywords.slice(0, 8).map((k, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[9px] rounded-md border border-red-100 dark:border-red-900/30">
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase">Top Suggestions:</p>
                    {atsSuggestions.slice(0, 3).map((s, i) => (
                      <p key={i} className="text-[10px] text-gray-600 dark:text-gray-400 leading-tight flex gap-2">
                        <span className="text-primary-500 font-black">•</span> {s}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Smart Summary Writer Feature */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Optimize Writing</h3>
              <Card className="px-3 py-4 bg-primary-50/50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/30">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">Turn your loose bullet points into a highly structural executive summary perfectly matching the tech industry narrative.</p>
                <Button onClick={handleGenerateSummary} disabled={isGenerating} className="w-full text-xs py-2 shadow-primary-500/20">
                  {isGenerating ? 'Writing with AI...' : 'Rewrite Summary with AI'}
                </Button>
                {aiMode && <p className="text-[10px] text-center mt-2 text-primary-600 dark:text-primary-400 font-medium">Rendered via {aiMode}</p>}
              </Card>
            </div>

            {/* Live Bullet Generation Hook */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Bullet Generator</h3>
              <Card className="p-3">
                <input 
                  type="text" 
                  value={jobTitle} 
                  onChange={e => setJobTitle(e.target.value)} 
                  placeholder="e.g. Frontend Engineeer" 
                  className="w-full text-xs p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded mb-2 focus:outline-none focus:border-primary-500" 
                />
                <Button onClick={handleGenerateBulletPoints} disabled={isGeneratingBullets} variant="secondary" className="w-full text-xs py-2">
                  {isGeneratingBullets ? 'Analyzing Database...' : 'Generate Impact Metrics'}
                </Button>
                
                {/* Skill Suggester */}
                <Button onClick={handleSuggestSkills} disabled={isSuggestingSkills} variant="ghost" className="w-full text-[10px] mt-2 h-8 border-dashed border-gray-300 dark:border-gray-600">
                  {isSuggestingSkills ? 'Researching...' : 'Suggest Skills for this Role'}
                </Button>

                {suggestedSkills.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-[10px] font-bold mb-2 uppercase text-gray-500 tracking-wider">Recommended Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {suggestedSkills.map((skill, i) => (
                        <button 
                          key={i} 
                          onClick={() => setFormData(prev => ({...prev, skills: prev.skills ? prev.skills + ', ' + skill : skill}))}
                          className="text-[9px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-1.5 py-0.5 rounded hover:border-primary-500 hover:text-primary-600 transition-all flex items-center gap-1"
                        >
                          <FiPlus className="w-2 h-2" /> {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {bulletPoints.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2">
                    {bulletPoints.map((bp, i) => (
                      <div key={i} className="text-xs text-gray-600 dark:text-gray-400 leading-tight bg-gray-50 dark:bg-gray-800 p-2 rounded relative group cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        {bp}
                        <button className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-primary-600" onClick={() => setFormData(prev => ({...prev, experience: prev.experience + '\n- ' + bp}))}><FiPlus/></button>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

             {/* Export Array Links */}
             <div className="pt-6 border-t border-gray-100 dark:border-gray-700 space-y-2">
                <Button variant="secondary" onClick={() => executeDownload('pdf')} className="w-full justify-start text-xs font-semibold gap-3 bg-white hover:bg-gray-50"><FiDownload className="text-red-500" /> Export Standard PDF</Button>
                <Button variant="secondary" onClick={() => executeDownload('png')} className="w-full justify-start text-xs font-semibold gap-3 bg-white hover:bg-gray-50"><FiImage className="text-blue-500" /> Save as HD Graphic</Button>
             </div>

          </div>
        </aside>

      </div>
    </div>
  );
};

export default ResumeBuilder;
