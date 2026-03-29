import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiPlus, FiFileText, FiClock, FiStar, FiZap, FiDownload, FiActivity, 
  FiLayout, FiCheckCircle, FiInfo, FiTrendingUp, FiCopy, FiTrash2, FiExternalLink, FiArrowRight
} from 'react-icons/fi';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { resumeAPI, profileAPI } from '../utils/api';
import { useSearch } from '../context/SearchContext';
import { useToast } from '../context/ToastContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [resumes, setResumes] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { searchQuery } = useSearch();
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([fetchResumes(), fetchProfile()]);
    } catch (err) {
      addToast("Failed to load dashboard data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await profileAPI.getProfile();
      if (response.data.success) {
        setProfile(response.data.profile);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const fetchResumes = async () => {
    try {
      const response = await resumeAPI.getResumes();
      if (response.data.success) {
        setResumes(response.data.resumes);
      }
    } catch (err) {
      console.error('Error fetching resumes:', err);
    }
  };

  const filteredResumes = resumes.filter(resume => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (resume.name || '').toLowerCase().includes(searchLower) ||
      (resume.template || '').toLowerCase().includes(searchLower)
    );
  });

  // --- Sub-components (Polished) ---

  const ProfileCompletionCard = ({ data }) => {
    const completion = data?.profileCompletion || 0;
    
    return (
      <Card className="p-6 border-none bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary-500/30 transition-colors duration-700"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-end mb-6">
            <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-400 mb-1">Profile Strength</p>
                <h3 className="text-white !text-2xl m-0">{completion}%</h3>
            </div>
            <FiActivity className="text-primary-500 w-6 h-6 opacity-50" />
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full mb-8 overflow-hidden">
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${completion}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary-500 to-indigo-500"
            ></motion.div>
          </div>
          <Button 
            size="sm"
            onClick={() => navigate('/profile')} 
            className="w-full bg-white/10 hover:bg-white/20 border-white/10 text-white text-[10px] uppercase font-bold tracking-widest py-3 rounded-xl backdrop-blur-md transition-all"
          >
            Enhance Profile
          </Button>
        </div>
      </Card>
    );
  };

  const AISuggestionsCard = () => (
    <Card className="p-6 !bg-white dark:!bg-slate-900/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-primary-600">
          <FiZap className="w-5 h-5" />
        </div>
        <h4 className="m-0 !text-lg">AI Insights</h4>
      </div>
      <div className="space-y-4">
        {[
          { text: 'Add measurable achievements to your summary', type: 'impact' },
          { text: 'Your technical skills section is looking strong', type: 'strength' },
        ].map((tip, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/50">
            <FiInfo className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">{tip.text}</p>
          </div>
        ))}
      </div>
    </Card>
  );

  const QuickActions = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div 
        onClick={() => navigate('/builder')}
        className="group relative overflow-hidden rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300 cursor-pointer"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-primary-500/10 transition-colors"></div>
        <div className="flex flex-col h-full justify-between gap-8">
            <div className="p-4 bg-primary-500 text-white rounded-2xl w-fit shadow-xl shadow-primary-500/20 group-hover:rotate-6 transition-transform">
                <FiPlus className="w-6 h-6" />
            </div>
            <div>
                <h3 className="m-0 mb-2">Build New Resume</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Standardize your path to success using AI guidance.</p>
            </div>
        </div>
      </div>

      <div 
        onClick={() => navigate('/templates')}
        className="group relative overflow-hidden rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors"></div>
        <div className="flex flex-col h-full justify-between gap-8">
            <div className="p-4 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl w-fit shadow-xl group-hover:-rotate-6 transition-transform">
                <FiLayout className="w-6 h-6" />
            </div>
            <div>
                <h3 className="m-0 mb-2">Browse Templates</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Recruiter-tested layouts designed to pass complex ATS.</p>
            </div>
        </div>
      </div>
    </div>
  );

  const DocumentCard = ({ resume }) => (
    <Card hoverable className="p-0 !bg-white dark:!bg-slate-900/50 flex flex-col group overflow-visible">
       <div className="relative h-48 bg-slate-100 dark:bg-slate-800/50 rounded-t-2xl flex items-center justify-center p-6 transition-colors group-hover:bg-slate-200 dark:group-hover:bg-slate-800">
           {/* Visual Mockup */}
           <div className="w-2/3 h-full bg-white dark:bg-slate-900 shadow-2xl rounded-t-lg border border-slate-200/50 dark:border-slate-700 p-4 transform translate-y-4 group-hover:translate-y-2 transition-transform duration-500">
                <div className="w-1/2 h-2 bg-slate-100 dark:bg-slate-800 rounded mb-3"></div>
                <div className="space-y-1.5 opacity-50">
                    <div className="w-full h-1 bg-slate-50 dark:bg-slate-800 rounded"></div>
                    <div className="w-4/5 h-1 bg-slate-50 dark:bg-slate-800 rounded"></div>
                    <div className="w-full h-1 bg-slate-50 dark:bg-slate-800 rounded"></div>
                </div>
           </div>

           <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg hover:text-primary-500 transition-colors"><FiCopy className="w-4 h-4" /></button>
               <button className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg hover:text-rose-500 transition-colors"><FiTrash2 className="w-4 h-4" /></button>
           </div>
       </div>
       <div className="p-6 pt-10">
          <h4 className="m-0 mb-2 !text-base line-clamp-1 group-hover:text-primary-600 transition-colors">{resume.name || 'Untitled Resume'}</h4>
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <span className="flex items-center gap-1.5"><FiClock className="w-3 h-3" /> {new Date(resume.updatedAt).toLocaleDateString()}</span>
              <button 
                onClick={() => navigate('/builder', { state: { resume } })}
                className="text-primary-600 hover:text-primary-700 underline underline-offset-4"
              >
                Open Editor
              </button>
          </div>
       </div>
    </Card>
  );

  return (
    <div className="max-w-[1500px] mx-auto p-6 lg:p-12 space-y-12 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      
      {/* Dynamic Welcome Hero */}
      <section className="relative p-10 lg:p-14 rounded-[3rem] bg-slate-900 border border-white/5 shadow-2xl overflow-hidden group">
        <div className="absolute top-0 right-0 w-[600px] h-full bg-primary-500/10 blur-[120px] rounded-full pointer-events-none group-hover:bg-primary-500/15 transition-colors duration-700"></div>
        <div className="absolute bottom-0 left-[-10%] w-[400px] h-[300px] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-8">
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-inner backdrop-blur-md">
                    Dashboard v2.0
                </span>
                <span className="w-1 h-1 rounded-full bg-white/20"></span>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Market Trends: Active</p>
            </div>
            <h1 className="text-white !leading-tight !text-4xl lg:!text-6xl mb-6 font-black tracking-tighter m-0">
               Hello, <span className="text-gradient">{(user.name || 'User').split(' ')[0]}</span>.
            </h1>
            <p className="text-white/50 text-lg lg:text-xl font-medium leading-relaxed max-w-lg m-0">
               Your resume is the blueprint for your next career jump. We've enhanced our AI to better align with current hiring trends.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4">
             <Button size="lg" onClick={() => navigate('/builder')} className="group shadow-2xl shadow-primary-500/20">
                <FiPlus className="mr-2 group-hover:rotate-90 transition-transform" /> New Document
             </Button>
             <Button variant="secondary" size="lg" onClick={() => navigate('/templates')} className="!bg-white/5 !border-white/10 !text-white hover:!bg-white/10">
                <FiLayout className="mr-2" /> Templates
             </Button>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* Main Feed (Left) */}
        <div className="xl:col-span-9 space-y-12">
            
            {/* Quick Actions Title */}
            <div className="space-y-8">
                <h2 className="flex items-center gap-3 !text-2xl m-0"><FiZap className="text-amber-500" /> Essential Actions</h2>
                <QuickActions />
            </div>

            {/* Document Feed Area */}
            <div className="space-y-8">
                <div className="flex items-end justify-between px-2">
                    <h2 className="flex items-center gap-3 !text-2xl m-0"><FiFileText className="text-primary-500" /> Recent Documents</h2>
                    <button onClick={() => navigate('/resumes')} className="text-xs font-bold text-slate-500 hover:text-primary-600 transition-colors uppercase tracking-widest border-b-2 border-transparent hover:border-primary-500 pb-1">View All</button>
                </div>

                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-slate-200 dark:bg-slate-900 rounded-[2rem] animate-pulse"></div>
                    ))}
                  </div>
                ) : filteredResumes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredResumes.slice(0, 5).map((resume, idx) => (
                      <DocumentCard key={idx} resume={resume} />
                    ))}
                    {/* Empty State / Add Card */}
                    <div 
                        onClick={() => navigate('/builder')}
                        className="group flex flex-col items-center justify-center p-8 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-primary-500/50 hover:bg-white dark:hover:bg-slate-900/50 transition-all cursor-pointer min-h-[320px]"
                    >
                        <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl mb-6 group-hover:scale-110 transition-transform">
                            <FiPlus className="w-8 h-8 text-slate-400 group-hover:text-primary-500" />
                        </div>
                        <h4 className="m-0 mb-1 !text-lg">Add Resume</h4>
                        <p className="text-xs font-medium text-slate-400">Expand your career portfolio.</p>
                    </div>
                  </div>
                ) : (
                  <Card className="flex flex-col items-center justify-center p-20 text-center !bg-transparent border-dashed border-slate-200 dark:border-slate-800">
                      <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-3xl flex items-center justify-center mb-6">
                        <FiFileText className="w-10 h-10 text-primary-500" />
                      </div>
                      <h3 className="m-0 mb-3 !text-2xl">No Resumes Found</h3>
                      <p className="text-slate-500 max-w-xs mx-auto mb-10 font-medium">It looks like you haven't started any documents yet. Launch the builder to get started.</p>
                      <Button onClick={() => navigate('/builder')}>Start Building Now</Button>
                  </Card>
                )}
            </div>
        </div>

        {/* Sidebar Space (Right) */}
        <div className="xl:col-span-3 space-y-8">
            <ProfileCompletionCard data={profile} />
            <AISuggestionsCard />
            
            {/* Promotion / Resource Card */}
            <Card className="p-6 !bg-gradient-to-br !from-primary-600 !to-indigo-600 border-none relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer">
                <FiTrendingUp className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 mb-2">Pro Tip</p>
                    <p className="text-white font-bold leading-relaxed m-0 mb-6 group-hover:translate-x-1 transition-transform">
                        "Recruiters scan resumes in under 6 seconds. Make your impact felt."
                    </p>
                    <button className="flex items-center gap-2 text-white/90 text-xs font-bold hover:gap-3 transition-all">
                        Master the Scan <FiArrowRight />
                    </button>
                </div>
            </Card>

            <Card className="p-6 !bg-white dark:!bg-slate-900/50 flex items-center justify-between group cursor-pointer border-slate-100 dark:border-slate-800 hover:border-primary-500/30 transition-all">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                        <FiInfo className="text-slate-400 group-hover:text-primary-500 transition-colors" />
                    </div>
                    <div>
                        <p className="m-0 text-xs font-bold text-slate-900 dark:text-white">Help Center</p>
                        <p className="m-0 text-[10px] font-medium text-slate-400">Guides & Support</p>
                    </div>
                </div>
                <FiExternalLink className="text-slate-300 group-hover:text-primary-500" />
            </Card>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
