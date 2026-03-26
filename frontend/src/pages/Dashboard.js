import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiPlus, FiFileText, FiMoreVertical, FiShare2, FiEdit2, 
  FiClock, FiStar, FiChevronDown, FiZap, FiDownload, FiActivity, FiLayout
} from 'react-icons/fi';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { resumeAPI } from '../utils/api';
import { useSearch } from '../context/SearchContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aiGenerations, setAiGenerations] = useState(0);
  const { searchQuery } = useSearch();
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Dummy Fallback Data targeting specific naming structure instructions
  const dummyResumes = [
    { _id: '1', name: 'Product Manager — Google Application', template: 'Modern Professional', updatedAt: '2026-03-05T10:00:00Z' },
    { _id: '2', name: 'Senior PM — Targeted', template: 'Executive', updatedAt: '2026-02-20T14:30:00Z' },
    { _id: '3', name: 'Entry Level Resume — Student', template: 'Student Starter', updatedAt: '2026-01-12T09:15:00Z' },
  ];

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      // Load AI Generations count
      const count = parseInt(localStorage.getItem('ai_generations_count') || '0');
      setAiGenerations(count);

      const response = await resumeAPI.getResumes();
      let fetchedResumes = [];
      
      if (response.data.success && response.data.resumes.length > 0) {
        fetchedResumes = response.data.resumes;
      } else {
        // Fallback to localStorage if API is empty
        const localResumes = JSON.parse(localStorage.getItem('ai_resumes') || '[]');
        fetchedResumes = localResumes.length > 0 ? localResumes : dummyResumes;
      }
      setResumes(fetchedResumes);
    } catch (err) {
      console.error('Error fetching resumes:', err);
      const localResumes = JSON.parse(localStorage.getItem('ai_resumes') || '[]');
      setResumes(localResumes.length > 0 ? localResumes : dummyResumes);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredResumes = resumes.filter(resume => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (resume.name || '').toLowerCase().includes(searchLower) ||
      (resume.template || '').toLowerCase().includes(searchLower) ||
      (resume.summary || '').toLowerCase().includes(searchLower)
    );
  });

  const aiTools = [
    { title: 'Generate from Job Description', desc: 'Paste a JD and let AI build your resume.', icon: FiFileText, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { title: 'Magic Rewrite', desc: 'Instantly upgrade the tone of any section.', icon: FiZap, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { title: 'Optimize Skills', desc: 'Find missing keywords for ATS compliance.', icon: FiStar, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  ];

  const activities = [
    { text: 'Exported "Product Manager" to PDF', time: '2 hours ago' },
    { text: 'AI updated Summary section', time: '5 hours ago' },
    { text: 'Created new resume "Senior PM"', time: 'Yesterday' },
  ];

  return (
    <div className="max-w-[1600px] mx-auto p-6 lg:p-8 flex flex-col xl:flex-row gap-8">
            
            {/* MAIN COLUMN (LEFT) - 2 Column Split Spec */}
            <div className="flex-1 space-y-8">
              {/* Header / Actions Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 dark:bg-primary-900/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                <div className="relative z-10">
                  <h1 className="text-2xl font-bold mb-1">Welcome back, {user.name?.split(' ')[0] || 'Jane'}!</h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">You have several drafts ready to export. Let's land that dream job.</p>
                </div>
                
                <div className="relative z-10">
                  <div className="relative">
                    <Button 
                      onClick={() => navigate('/builder')}
                      className="gap-2 shadow-lg shadow-primary-500/20"
                    >
                      <FiPlus className="w-4 h-4" /> Create New
                    </Button>
                  </div>
                </div>
              </div>

              {/* Graphical Resume Data Grid Area */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Documents</h2>
                  <button onClick={() => navigate('/resumes')} className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">View All</button>
                </div>
                
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1,2,3].map(i => <div key={i} className="h-64 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse delay-75"></div>)}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResumes.length > 0 ? (
                      filteredResumes.map((resume, idx) => (
                        <Card key={idx} hoverable className="flex flex-col h-full group bg-white dark:bg-gray-800">
                          {/* Thumbnail View Abstraction */}
                          <div className="h-40 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 flex items-center justify-center p-4 relative overflow-hidden cursor-pointer" onClick={() => navigate('/builder', { state: { resume } })}>
                            <div className="absolute inset-x-8 top-8 bottom-0 bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-t-lg mx-auto w-3/4 p-3 overflow-hidden opacity-80 group-hover:opacity-100 transition-opacity">
                              <div className="w-1/2 h-2 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                              <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded mb-1"></div>
                              <div className="w-5/6 h-1 bg-gray-100 dark:bg-gray-800 rounded mb-1"></div>
                              <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded mb-4"></div>
                              <div className="w-1/3 h-2 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                              <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded mb-1"></div>
                            </div>
                          </div>
                          
                          <div className="p-5 flex-1 flex flex-col">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{resume.name || 'Untitled Document'}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-1">
                              <FiClock className="w-3 h-3" /> 
                              Edited {new Date(resume.updatedAt).toLocaleDateString()}
                            </p>
                            
                            <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700/50">
                              <Button variant="secondary" className="flex-1 py-1.5 text-xs font-semibold" onClick={() => navigate('/builder', { state: { resume } })}>
                                Open Editor
                              </Button>
                              <button onClick={() => alert('Share link copied to clipboard!')} className="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-700 tooltip">
                                <FiShare2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => alert('More options coming soon')} className="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-700 shadow-sm">
                                <FiMoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div className="col-span-full py-20 text-center bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                        <FiFileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No resumes found</h3>
                        <p className="text-gray-500 dark:text-gray-400">Try adjusting your search query or create a new one.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT PANEL COMPOSITION */}
            <div className="w-full xl:w-80 space-y-6 flex-shrink-0">
              
              {/* Quick High-Level Stats Widget */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 flex flex-col items-center justify-center text-center">
                  <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Total Resumes</h4>
                  <p className="text-3xl font-black text-gray-900 dark:text-white">{resumes.length}</p>
                </Card>
                <Card className="p-4 flex flex-col items-center justify-center text-center">
                  <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">AI Generations</h4>
                  <p className="text-3xl font-black text-gray-900 dark:text-white">{aiGenerations}</p>
                </Card>
                <Card className="p-4 col-span-2 flex items-center gap-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white border-none shadow-lg shadow-primary-500/20">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                    <FiStar className="w-6 h-6 fill-white text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white/90">Profile Completion</h4>
                    <p className="text-2xl font-black">85<span className="text-lg font-medium text-white/70">%</span></p>
                  </div>
                </Card>
              </div>

              {/* Isolated Functional Launchers */}
              <Card className="p-5 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <FiZap className="w-5 h-5 text-accent-500" />
                  <h3 className="font-bold text-gray-900 dark:text-white">AI Quick Tools</h3>
                </div>
                <div className="space-y-3">
                  {aiTools.map((tool, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                      <div className={`w-8 h-8 rounded-lg ${tool.bg} flex items-center justify-center shrink-0 shadow-sm`}>
                        <tool.icon className={`w-4 h-4 ${tool.color}`} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">{tool.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{tool.desc}</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full text-xs font-semibold mt-2 text-primary-600 hover:text-primary-700" onClick={() => navigate('/ai-tools')}>
                    View All Integrations →
                  </Button>
                </div>
              </Card>

              {/* Live Timeline Display Component */}
              <Card className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <FiActivity className="w-5 h-5 text-gray-400" />
                  <h3 className="font-bold text-gray-900 dark:text-white">Recent Activity</h3>
                </div>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 dark:before:via-gray-700 before:to-transparent">
                  {activities.map((act, idx) => (
                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center w-full gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary-500 shrink-0 ring-4 ring-white dark:ring-gray-800 z-10 transition-transform group-hover:scale-125"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{act.text}</p>
                          <p className="text-xs text-gray-400">{act.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

            </div>
    </div>
  );
};

export default Dashboard;
