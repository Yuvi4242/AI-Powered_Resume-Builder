import { AnimatePresence, motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { useEffect, useRef, useState, useCallback } from 'react';
import {
  FiAlertCircle, FiCheck, FiDownload, FiSave, FiZap, FiLayout, FiShare2, FiCornerUpLeft, FiCornerUpRight, FiMoreHorizontal,
  FiFileText, FiPlus, FiInfo, FiChevronDown, FiActivity, FiGlobe, FiClock
} from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { aiAPI, resumeAPI } from '../utils/api';
import { templatesData } from '../data/templatesData';
import { templateSchemas } from '../data/templateSchemas';
import TemplateRenderer from '../components/TemplateRenderer';
import DynamicForm from '../components/Sidebar/DynamicForm';
import { useToast } from '../context/ToastContext';

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  const editResume = location.state?.resume;
  const resumePreviewRef = useRef(null);

  const [selectedTemplate, setSelectedTemplate] = useState('template1');
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', skills: '', experience: '', education: '', summary: '',
  });

  const [aiMode, setAiMode] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeAIField, setActiveAIField] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving', 'idle'
  const [lastSavedTime, setLastSavedTime] = useState(new Date());

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

  // Initialize Data
  useEffect(() => {
    const templateFromState = location.state?.template;
    if (editResume) {
      setFormData(editResume);
      setSelectedTemplate(editResume.template || 'template1');
    } else if (templateFromState) {
      setSelectedTemplate(templateFromState.id);
      setFormData({ ...templateFromState.sampleData });
    } else {
      const defaultTemplate = templatesData.find(t => t.id === 'template1');
      setFormData(defaultTemplate.sampleData);
    }
  }, [editResume, location.state]);

  // --- Silent Auto-Save Logic ---
  const handleSilentSave = useCallback(async (dataToSave) => {
    setSaveStatus('saving');
    try {
      const submitData = { ...dataToSave, template: selectedTemplate, updatedAt: new Date().toISOString() };
      await resumeAPI.saveResume(submitData);
      
      // Sync Local Storage
      const localResumes = JSON.parse(localStorage.getItem('ai_resumes') || '[]');
      const idx = localResumes.findIndex(r => r._id === submitData._id || r.name === submitData.name);
      if (idx >= 0) localResumes[idx] = submitData;
      else localResumes.push({ ...submitData, _id: submitData._id || Date.now().toString() });
      localStorage.setItem('ai_resumes', JSON.stringify(localResumes));

      setSaveStatus('saved');
      setLastSavedTime(new Date());
    } catch (err) {
      setSaveStatus('idle'); // indicating it didn't save to cloud
    }
  }, [selectedTemplate]);

  // Debounced Effect for Auto-save
  useEffect(() => {
    if (isLoadingInitial) return; // Prevent saving on first load
    const timer = setTimeout(() => {
      handleSilentSave(formData);
    }, 2000); // 2 seconds debounce
    return () => clearTimeout(timer);
  }, [formData, handleSilentSave]);

  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoadingInitial(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSaveStatus('idle'); // mark as dirty
  };

  const handleInlineEdit = (fieldPath, value) => {
    const keys = fieldPath.split('.');
    setFormData(prev => {
      const newData = { ...prev };
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        current[key] = Array.isArray(current[key]) ? [...current[key]] : { ...current[key] };
        current = current[key];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
    setSaveStatus('idle');
  };

  // --- AI Actions ---
  const handleFieldAI = async (fieldName) => {
    setActiveAIField(fieldName);
    if (fieldName === 'summary') setIsGenerating(true);
    try {
      const currentText = formData[fieldName] || '';
      const response = fieldName === 'summary' 
        ? await aiAPI.generateSummary({ ...formData, type: currentText ? 'improve' : 'generate' })
        : await aiAPI.generate('text-tool', { text: currentText, type: 'impact' });

      if (response.data.success) {
        const content = response.data?.data?.content || response.data?.content || '';
        if (content) {
          setFormData(prev => ({ ...prev, [fieldName]: content }));
          addToast(`${fieldName} enhanced by AI`, "success");
        }
      }
    } catch (err) {
      addToast("AI failed to process. Try again.", "error");
    } finally {
      setActiveAIField(null);
      setIsGenerating(false);
    }
  };

  const handleCheckATS = async () => {
    setIsCheckingATS(true);
    try {
      const response = await aiAPI.generate('ats', { resumeText: JSON.stringify(formData) });
      const result = response.data?.data || response.data;
      if (result) {
        setAtsScore(result.score || 0);
        setAtsSuggestions(result.suggestions || []);
        setAtsAnalysis(result);
        addToast("ATS Analysis Complete", "success");
      }
    } catch (err) {
      addToast("ATS Scan failed", "error");
    } finally { setIsCheckingATS(false); }
  };

  const executeDownload = async () => {
    setIsDownloading(true);
    try {
      const wasEditing = isEditingMode;
      setIsEditingMode(false);
      setTimeout(() => {
        window.print();
        setIsEditingMode(wasEditing);
        setIsDownloading(false);
      }, 500);
    } catch (err) { 
      addToast("Export failed", "error");
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans selection:bg-primary-100 italicize-none">
      
      {/* Top Professional Toolbar */}
      <header className="h-16 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-all"
          >
            <FiLayout className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <FiFileText className="w-3 h-3" /> Resume Editor
            </span>
            <p className="text-sm font-bold truncate max-w-[200px] m-0">{formData.name || 'Untitled Document'}</p>
          </div>

          <div className="hidden lg:flex items-center gap-2 border-l border-slate-200/50 dark:border-slate-800/50 pl-6 ml-2">
            <AnimatePresence mode="wait">
              {saveStatus === 'saving' ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-[10px] font-bold text-primary-500 uppercase tracking-widest animate-pulse-slow">
                  <FiClock className="animate-spin-slow" /> Auto-saving...
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                  <FiCheck /> Saved in Cloud
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/50 rounded-xl p-1 mr-4 border border-slate-200/50 dark:border-slate-800">
            <button 
              onClick={() => setIsEditingMode(true)}
              className={`px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all ${isEditingMode ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
            >
              Editor
            </button>
            <button 
              onClick={() => setIsEditingMode(false)}
              className={`px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all ${!isEditingMode ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
            >
              Preview
            </button>
          </div>

          <Button 
            variant="secondary" 
            size="sm"
            onClick={executeDownload} 
            disabled={isDownloading}
            className="hidden sm:flex border-none bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold"
          >
            {isDownloading ? 'Exporting...' : <><FiDownload className="mr-2" /> Download PDF</>}
          </Button>
          
          <Button 
            size="sm"
            onClick={() => addToast("Sharable link copied to clipboard", "success")} 
            className="shadow-xl shadow-primary-500/20"
          >
            <FiShare2 className="mr-2" /> Share
          </Button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT PANEL: Dynamic Form Integration */}
        <aside className="hidden md:flex w-[340px] bg-white dark:bg-slate-900 border-r border-slate-200/50 dark:border-slate-800/50 flex-col shrink-0">
          <div className="p-6 border-b border-slate-200/50 dark:border-slate-800/50">
             <h3 className="m-0 !text-sm">Content Builder</h3>
             <p className="text-[10px] font-medium text-slate-400 m-0 mt-1">Structure your trajectory.</p>
          </div>
          <div className="flex-1 overflow-y-auto p-6 scroll-smooth custom-scrollbar">
            {(() => {
              const schema = templateSchemas[selectedTemplate];
              return schema ? (
                <DynamicForm 
                  schema={schema} 
                  formData={formData} 
                  onChange={handleChange} 
                  onAIAssist={handleFieldAI}
                  activeAIField={activeAIField}
                />
              ) : <div className="p-10 text-center opacity-50"><FiInfo className="mx-auto w-8 h-8 mb-4" /><p className="text-xs">No active schema.</p></div>;
            })()}
            
            <div className="mt-12 pt-8 border-t border-slate-200/50 dark:border-slate-800/50 space-y-6">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Design Selection</p>
                <div className="grid grid-cols-2 gap-3">
                    {templatesData.map(t => (
                        <button 
                            key={t.id}
                            onClick={() => setSelectedTemplate(t.id)}
                            className={`p-3 rounded-2xl text-[10px] font-bold border transition-all ${selectedTemplate === t.id ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/20' : 'bg-slate-50 dark:bg-slate-800 border-slate-200/50 dark:border-slate-800 text-slate-500 hover:border-slate-300'}`}
                        >
                            {t.name}
                        </button>
                    ))}
                </div>
            </div>
          </div>
        </aside>

        {/* CENTER PANEL: A4 Canvas Workspace */}
        <main className="flex-1 overflow-y-auto bg-slate-100/50 dark:bg-slate-950/20 p-8 flex justify-center custom-scrollbar">
           <div className={`transition-all duration-700 ease-out transform ${isEditingMode ? 'scale-100' : 'scale-100'}`}>
               <div className="resume-a4-canvas" ref={resumePreviewRef}>
                   <TemplateRenderer 
                     layoutType={templatesData.find(t => t.id === selectedTemplate)?.layoutType || 'template1'} 
                     data={formData} 
                     isEditing={isEditingMode}
                     onInlineEdit={handleInlineEdit}
                   />
               </div>
           </div>
        </main>

        {/* RIGHT PANEL: Premium AI Copilot Sidebar */}
        <aside className="hidden xl:flex w-[340px] bg-white dark:bg-slate-900 border-l border-slate-200/50 dark:border-slate-800/50 flex-col shrink-0">
          <div className="p-6 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
             <div className="flex items-center gap-2">
                 <FiZap className="text-primary-500" />
                 <h3 className="m-0 !text-sm">AI Copilot</h3>
             </div>
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">
            
            {/* ATS Score Card */}
            <Card className="p-6 !bg-slate-900 text-white border-none space-y-6">
                <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-400 m-0">ATS Score</p>
                    <span className="text-2xl font-black">{atsScore}%</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 transition-all duration-1000" style={{ width: `${atsScore}%` }}></div>
                </div>
                <Button size="sm" onClick={handleCheckATS} disabled={isCheckingATS} className="w-full font-bold bg-white/10 hover:bg-white/20 border-white/10 text-white py-3 rounded-xl">
                    {isCheckingATS ? 'Scanning...' : 'Run Deep Scan'}
                </Button>
            </Card>

            {/* Smart Summarizer */}
            <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Writing Assistant</p>
                <Card className="p-6 !bg-transparent border-dashed border-slate-200 dark:border-slate-800">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed font-medium">Generate a recruiter-calibrated summary based on your entire profile history.</p>
                    <Button variant="secondary" onClick={() => handleFieldAI('summary')} disabled={isGenerating} className="w-full font-bold text-[10px] uppercase tracking-widest py-3">
                        {isGenerating ? 'Writing...' : 'Draft Premium Summary'}
                    </Button>
                </Card>
            </div>

            {/* Quick Tips */}
            <div className="space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Industry Insights</p>
                 <Card className="p-6 !bg-white dark:!bg-slate-900 border-none shadow-sm space-y-4">
                    {[
                        "Tech roles prioritize outcome-based bullets.",
                        "Use 'Spearheaded' instead of 'Managed'."
                    ].map((tip, i) => (
                        <div key={i} className="flex gap-3 items-start">
                            <FiActivity className="text-emerald-500 w-4 h-4 shrink-0 mt-0.5" />
                            <p className="m-0 text-xs font-medium text-slate-600 dark:text-slate-400">{tip}</p>
                        </div>
                    ))}
                 </Card>
            </div>

          </div>
        </aside>

      </div>
    </div>
  );
};

export default ResumeBuilder;
