import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFileText, FiCheck, FiBriefcase, FiAward, FiAlertCircle, FiZap, FiLoader } from 'react-icons/fi';
import AIToolCard from '../components/AIToolCard';
import { aiAPI } from '../utils/api';

const tools = [
  {
    id: 'summary',
    title: 'Resume Summary',
    description: 'Generate a professional summary highlighting your best skills and experience.',
    icon: FiFileText,
    gradient: 'from-purple-500 to-indigo-500'
  },
  {
    id: 'ats',
    title: 'ATS Score Checker',
    description: 'Analyze your resume against Applicant Tracking Systems to maximize your chances.',
    icon: FiCheck,
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'bullets',
    title: 'Bullet Points Engine',
    description: 'Transform your job titles into powerful, action-oriented bullet points.',
    icon: FiBriefcase,
    gradient: 'from-amber-500 to-orange-500'
  },
  {
    id: 'skills',
    title: 'Skill Suggestions',
    description: 'Discover the most relevant industry skills matching your target job role.',
    icon: FiAward,
    gradient: 'from-emerald-500 to-teal-500'
  }
];

const AIToolsDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTool, setActiveTool] = useState('summary');

  // Unified Processing and Error States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMode, setSuccessMode] = useState(null);

  // Form States
  const [summaryData, setSummaryData] = useState({ skills: '', experience: '' });
  const [atsText, setAtsText] = useState('');
  const [bulletRole, setBulletRole] = useState('');
  const [skillRole, setSkillRole] = useState('');

  // Results States
  const [summaryResult, setSummaryResult] = useState('');
  const [atsResult, setAtsResult] = useState(null);
  const [bulletResult, setBulletResult] = useState([]);
  const [skillResult, setSkillResult] = useState([]);

  const handleGenerateSummary = async (e) => {
    e.preventDefault();
    if (!summaryData.skills || !summaryData.experience) {
      setError('Please provide both skills and experience.');
      return;
    }
    setLoading(true); setError(''); setSuccessMode(null); setSummaryResult('');
    try {
      const res = await aiAPI.generateSummary(summaryData);
      if (res.data.success) {
        setSummaryResult(res.data.summary);
        setSuccessMode(res.data.mode);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate summary.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckATS = async (e) => {
    e.preventDefault();
    if (!atsText) { setError('Please enter your resume text.'); return; }
    setLoading(true); setError(''); setSuccessMode(null); setAtsResult(null);
    try {
      const res = await aiAPI.checkATSScore({ resumeText: atsText });
      if (res.data.success) setAtsResult({ score: res.data.score, suggestions: res.data.suggestions });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to check ATS score.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBullets = async (e) => {
    e.preventDefault();
    if (!bulletRole) { setError('Please enter a job role.'); return; }
    setLoading(true); setError(''); setSuccessMode(null); setBulletResult([]);
    try {
      const res = await aiAPI.generateBulletPoints({ jobTitle: bulletRole });
      if (res.data.success) setBulletResult(res.data.points);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate bullet points.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestSkills = async (e) => {
    e.preventDefault();
    if (!skillRole) { setError('Please enter a job role.'); return; }
    setLoading(true); setError(''); setSuccessMode(null); setSkillResult([]);
    try {
      const res = await aiAPI.suggestSkills({ role: skillRole });
      if (res.data.success) setSkillResult(res.data.skills);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to suggest skills.');
    } finally {
      setLoading(false);
    }
  };

  // Rendering Helper for Results
  const renderResultBadge = () => {
    if (!successMode) return null;
    const isFallback = successMode === 'fallback';
    return (
      <span className={`px-3 py-1 ml-4 rounded-full text-sm font-semibold border ${
        isFallback 
          ? 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-800'
          : 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800'
      }`}>
        {isFallback ? 'Using Offline AI Mode' : successMode}
      </span>
    );
  };

  return (
    <div className="p-6 lg:p-8 overflow-y-auto w-full">
      <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Header section */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Centralized AI Toolkit</h1>
              <p className="text-gray-600 dark:text-gray-400">Everything you need to optimize and generate your professional resume assets, natively powered by Gemini.</p>
            </div>

            {/* Error Notifications Zone */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-3 shadow-lg"
                >
                  <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dynamic Content Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: UI Cards Stack */}
              <div className="lg:col-span-4 space-y-4">
                <h2 className="font-semibold text-gray-800 dark:text-white mb-4 uppercase tracking-wider text-sm tracking-widest pl-2">Select Active Tool</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                  {tools.map((tool) => (
                    <AIToolCard
                      key={tool.id}
                      {...tool}
                      isActive={activeTool === tool.id}
                      onClick={() => {
                        setActiveTool(tool.id);
                        setError('');
                        setSuccessMode(null);
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Right Column: Interactive Rendering Zone */}
              <div className="lg:col-span-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTool}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 lg:p-8 min-h-[500px]"
                  >
                    
                    {/* Feature 1: Summary Generator */}
                    {activeTool === 'summary' && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 pb-4">
                          <div className="p-3 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-xl">
                            <FiFileText className="w-6 h-6" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Summary Generator</h2>
                            <p className="text-gray-500 text-sm">Create a tailored professional summarization outline.</p>
                          </div>
                        </div>

                        <form onSubmit={handleGenerateSummary} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Associated Target Skills</label>
                            <input
                              type="text"
                              required
                              value={summaryData.skills}
                              onChange={(e) => setSummaryData({...summaryData, skills: e.target.value})}
                              placeholder="e.g. React, Node.js, Python, Leadership"
                              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Previous Work Experience Array</label>
                            <textarea
                              required
                              rows={4}
                              value={summaryData.experience}
                              onChange={(e) => setSummaryData({...summaryData, experience: e.target.value})}
                              placeholder="Briefly describe your past roles and achievements..."
                              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                            />
                          </div>
                          
                          <div className="flex items-center pt-2">
                            <button
                              type="submit"
                              disabled={loading}
                              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                              {loading ? <FiLoader className="w-5 h-5 animate-spin" /> : <FiZap className="w-5 h-5" />}
                              {loading ? 'Generating...' : 'Generate AI Summary'}
                            </button>
                            {renderResultBadge()}
                          </div>
                        </form>

                        {summaryResult && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-100 dark:border-purple-800/30">
                            <h3 className="text-purple-800 dark:text-purple-300 font-semibold mb-3">AI Compiled Output:</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{summaryResult}</p>
                          </motion.div>
                        )}
                      </div>
                    )}

                    {/* Feature 2: ATS Scope Processing */}
                    {activeTool === 'ats' && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 pb-4">
                          <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
                            <FiCheck className="w-6 h-6" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">ATS Validation Profile</h2>
                            <p className="text-gray-500 text-sm">Scan parameters mapped to applicant tracking environments.</p>
                          </div>
                        </div>

                        <form onSubmit={handleCheckATS} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Raw Resume Input Vector</label>
                            <textarea
                              required
                              rows={6}
                              value={atsText}
                              onChange={(e) => setAtsText(e.target.value)}
                              placeholder="Paste all your resume text here for algorithmic score analysis..."
                              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-y"
                            />
                          </div>
                          
                          <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 flex items-center gap-2"
                          >
                            {loading ? <FiLoader className="w-5 h-5 animate-spin" /> : <FiZap className="w-5 h-5" />}
                            {loading ? 'Executing Algorithms...' : 'Analyze Metrics'}
                          </button>
                        </form>

                        {atsResult && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="col-span-1 p-6 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/30 flex flex-col items-center justify-center">
                              <span className="text-sm text-blue-800 dark:text-blue-300 font-semibold mb-2">Target Grade</span>
                              <div className="text-5xl font-extrabold text-blue-600 dark:text-blue-400">{atsResult.score}<span className="text-2xl text-blue-400">/100</span></div>
                            </div>
                            <div className="col-span-2 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 shadow-inner">
                              <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2"><FiAward className="text-blue-500" /> Improvement Scope Vectors:</h3>
                              <ul className="space-y-2">
                                {atsResult.suggestions.map((s, i) => (
                                  <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                                    <span className="text-blue-500 mt-0.5">•</span> {s}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}

                    {/* Feature 3: Bullet Factory */}
                    {activeTool === 'bullets' && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 pb-4">
                          <div className="p-3 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-xl">
                            <FiBriefcase className="w-6 h-6" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Experience Engineering Array</h2>
                            <p className="text-gray-500 text-sm">Inflate rigid roles into impactful narrative achievements.</p>
                          </div>
                        </div>

                        <form onSubmit={handleGenerateBullets} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Associated Application Role</label>
                            <input
                              type="text"
                              required
                              value={bulletRole}
                              onChange={(e) => setBulletRole(e.target.value)}
                              placeholder="e.g. Lead Typescript Architect"
                              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                            />
                          </div>
                          
                          <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-amber-500/30 transition-all disabled:opacity-50 flex items-center gap-2"
                          >
                            {loading ? <FiLoader className="w-5 h-5 animate-spin" /> : <FiZap className="w-5 h-5" />}
                            {loading ? 'Sourcing Ideas...' : 'Generate Points'}
                          </button>
                        </form>

                        {bulletResult.length > 0 && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-800/30">
                            <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-4">Exportable Bullets:</h3>
                            <ul className="space-y-3">
                              {bulletResult.map((p, i) => (
                                <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-amber-100 dark:border-amber-800/20">
                                  <span className="text-amber-500 mt-0.5"><FiCheck /></span> {p}
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </div>
                    )}

                    {/* Feature 4: Competency Mapping */}
                    {activeTool === 'skills' && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 pb-4">
                          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
                            <FiAward className="w-6 h-6" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Competency Suggestions</h2>
                            <p className="text-gray-500 text-sm">Pinpoint the perfect stack layout identifying to your niche.</p>
                          </div>
                        </div>

                        <form onSubmit={handleSuggestSkills} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Target Corporate Role</label>
                            <input
                              type="text"
                              required
                              value={skillRole}
                              onChange={(e) => setSkillRole(e.target.value)}
                              placeholder="e.g. Marketing Executive"
                              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                          </div>
                          
                          <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50 flex items-center gap-2"
                          >
                            {loading ? <FiLoader className="w-5 h-5 animate-spin" /> : <FiZap className="w-5 h-5" />}
                            {loading ? 'Synthesizing Patterns...' : 'Map Technologies'}
                          </button>
                        </form>

                        {skillResult.length > 0 && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                            <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-4">Required Stack Signatures:</h3>
                            <div className="flex flex-wrap gap-2">
                              {skillResult.map((skill, i) => (
                                <span key={i} className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm shadow-sm font-medium tracking-wide">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}

                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
      </div>
    </div>
  );
};

export default AIToolsDashboard;
