import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiPlus, FiFileText, FiMoreVertical, FiShare2, FiEdit2, 
  FiClock, FiStar, FiChevronDown, FiZap, FiDownload, FiActivity, 
  FiLayout, FiCheckCircle, FiCheck, FiInfo, FiTrendingUp, FiSearch, FiCopy, FiTrash2, FiExternalLink, FiArrowRight
} from 'react-icons/fi';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { resumeAPI, profileAPI } from '../utils/api';
import { useSearch } from '../context/SearchContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [aiGenerations, setAiGenerations] = useState(0);
  const { searchQuery } = useSearch();
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Dummy Fallback Data
  const dummyResumes = [
    { _id: '1', name: 'Product Manager — Google', template: 'Modern Professional', updatedAt: '2026-03-05T10:00:00Z', status: 'Ready' },
    { _id: '2', name: 'Senior PM — Targeted', template: 'Executive', updatedAt: '2026-02-20T14:30:00Z', status: 'Draft' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    await Promise.all([fetchResumes(), fetchProfile()]);
    setIsLoading(false);
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
      const count = parseInt(localStorage.getItem('ai_generations_count') || '0');
      setAiGenerations(count);

      const response = await resumeAPI.getResumes();
      let fetchedResumes = [];
      
      if (response.data.success && response.data.resumes.length > 0) {
        fetchedResumes = response.data.resumes;
      } else {
        const localResumes = JSON.parse(localStorage.getItem('ai_resumes') || '[]');
        fetchedResumes = localResumes.length > 0 ? localResumes : dummyResumes;
      }
      setResumes(fetchedResumes);
    } catch (err) {
      console.error('Error fetching resumes:', err);
      const localResumes = JSON.parse(localStorage.getItem('ai_resumes') || '[]');
      setResumes(localResumes.length > 0 ? localResumes : dummyResumes);
    }
  };

  const filteredResumes = resumes.filter(resume => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (resume.name || '').toLowerCase().includes(searchLower) ||
      (resume.template || '').toLowerCase().includes(searchLower)
    );
  });

  // Helper Components for the new sections
  const ProfileCompletionCard = ({ data }) => {
    const completion = data?.profileCompletion || 0;
    
    const checklist = [
      { label: 'Personal Information', done: !!(data?.fullName && data?.phone) },
      { label: 'Professional Summary', done: !!data?.careerObjective },
      { label: 'Education Details', done: !!data?.collegeName },
      { label: 'Work Experience', done: (data?.experiences?.length > 0) },
      { label: 'Skills & Tags', done: (data?.technicalSkills?.length > 0) },
      { label: 'Profile Photo', done: !!data?.profileImage },
    ];

    return (
      <Card className="p-5 border-none bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary-500/20 transition-colors"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Profile Strength</h3>
            <span className="text-2xl font-black text-primary-400">{completion}%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full mb-6 overflow-hidden">
            <div className="h-full bg-primary-500 transition-all duration-1000" style={{ width: `${completion}%` }}></div>
          </div>
          <ul className="space-y-3 mb-6">
            {checklist.map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-xs">
                {item.done ? (
                  <FiCheckCircle className="text-primary-400 w-4 h-4 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-white/30 shrink-0"></div>
                )}
                <span className={item.done ? 'text-white/90 font-medium' : 'text-white/40'}>{item.label}</span>
              </li>
            ))}
          </ul>
          <Button onClick={() => navigate('/profile')} className="w-full bg-primary-600 hover:bg-primary-500 border-none text-xs py-2.5 font-bold rounded-xl shadow-lg shadow-primary-900/40">
            Complete Profile
          </Button>
        </div>
      </Card>
    );
  };

  const AISuggestionsCard = () => (
    <Card className="p-5 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 backdrop-blur-sm card-glow">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-purple-500/10 rounded-lg">
          <FiZap className="w-5 h-5 text-purple-500" />
        </div>
        <h3 className="font-bold text-gray-900 dark:text-white">AI Suggestions</h3>
      </div>
      <div className="space-y-4">
        <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-500">RESUME SCORE</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">78/100</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-primary-500" style={{ width: '78%' }}></div>
          </div>
        </div>
        <ul className="space-y-3">
          {[
            'Add measurable achievements',
            'Improve summary section',
            'Include 3 more tech skills',
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              <FiInfo className="w-3 h-3 text-primary-500 mt-0.5 shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );

  const StatsCard = () => (
    <Card className="p-5 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
      <h3 className="font-bold text-gray-900 dark:text-white mb-4">Resume Stats</h3>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Total', value: resumes.length, icon: FiFileText, color: 'text-blue-500' },
          { label: 'Exports', value: 12, icon: FiDownload, color: 'text-green-500' },
          { label: 'Templates', value: 4, icon: FiLayout, color: 'text-purple-500' },
          { label: 'Views', value: '1.2k', icon: FiActivity, color: 'text-orange-500' },
        ].map((stat, i) => (
          <div key={i} className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700/50">
            <div className={`p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 w-fit mb-2 ${stat.color}`}>
              <stat.icon className="w-3.5 h-3.5" />
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <div className="text-[10px] font-medium text-gray-500 uppercase tracking-tighter">{stat.label}</div>
          </div>
        ))}
      </div>
    </Card>
  );

  const TipCard = () => (
    <Card className="p-5 border-none bg-primary-600 relative overflow-hidden group">
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
      <div className="relative z-10 text-white">
        <div className="flex items-center gap-2 mb-2">
          <FiTrendingUp className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Pro Tip</span>
        </div>
        <p className="text-sm font-medium leading-normal mb-1">
          "Recruiters usually scan resumes in under 10 seconds. Use active verbs."
        </p>
        <button className="text-[11px] font-bold hover:underline opacity-80 pt-2 flex items-center gap-1">
          Learn More <FiExternalLink className="w-3 h-3" />
        </button>
      </div>
    </Card>
  );

  const QuickActions = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
      {/* Featured AI Card - Card 1 */}
      <div 
        onClick={() => navigate('/builder')}
        className="relative overflow-hidden group cursor-pointer rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary-500/20"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-primary-600 to-emerald-500 opacity-90 group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-700"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10 group-hover:scale-110 transition-transform duration-700"></div>

        <div className="relative z-10 flex flex-col h-full justify-between min-h-[160px]">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-inner group-hover:rotate-12 transition-transform">
              <FiZap className="w-8 h-8 text-white animate-pulse" />
            </div>
            <span className="px-3 py-1 bg-black/20 backdrop-blur-md text-white/90 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20">
              Most Popular
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-black text-white mb-2 group-hover:translate-x-1 transition-transform">Create with AI</h3>
            <p className="text-white/80 text-sm max-w-[240px] leading-relaxed">
              Generate a high-impact, ATS-optimized resume in minutes using our advanced AI.
            </p>
          </div>
        </div>
      </div>

      {/* Templates Card - Card 2 */}
      <div 
        onClick={() => navigate('/templates')}
        className="relative overflow-hidden group cursor-pointer rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 dark:bg-indigo-400/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
        
        <div className="relative z-10 flex flex-col h-full justify-between min-h-[160px]">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl border border-indigo-100 dark:border-indigo-800 transition-colors group-hover:bg-indigo-100 dark:group-hover:bg-indigo-800/50">
              <FiLayout className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 group-hover:translate-x-1 transition-transform">View Templates</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-[240px] leading-relaxed">
              Browse our collection of professional, recruiter-approved templates.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
            <span>Explore All</span>
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );

  const DocumentCard = ({ resume, isPlaceholder }) => {
    if (isPlaceholder) {
      return (
        <Card onClick={() => navigate('/builder')} className="flex flex-col h-full bg-gray-50 dark:bg-gray-800/30 border-2 border-dashed border-gray-200 dark:border-gray-700 items-center justify-center p-8 text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors group">
          <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
            <FiPlus className="w-6 h-6 text-gray-400" />
          </div>
          <h4 className="font-bold text-gray-900 dark:text-black mb-1">Create New</h4>
          <p className="text-xs text-gray-500">Add another document to fill your dashboard.</p>
        </Card>
      );
    }

    const statusColors = {
      'Ready': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      'Draft': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      'In Progress': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    };

    return (
      <Card hoverable className="flex flex-col h-full group bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/50 overflow-hidden card-glow">
        <div 
          className="h-40 bg-slate-50 dark:bg-slate-900 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-center p-4 relative overflow-hidden cursor-pointer" 
          onClick={() => navigate('/builder', { state: { resume } })}
        >
          {/* Status Badge */}
          <div className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[resume.status || 'Draft']} z-20 backdrop-blur-md`}>
            {resume.status || 'Draft'}
          </div>

          <div className="absolute inset-x-8 top-8 bottom-0 bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded-t-lg mx-auto w-3/4 p-4 overflow-hidden group-hover:scale-105 transition-transform duration-500">
            <div className="w-1/2 h-2.5 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="space-y-1.5">
              <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded"></div>
              <div className="w-5/6 h-1 bg-gray-100 dark:bg-gray-800 rounded"></div>
              <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded"></div>
              <div className="w-4/6 h-1 bg-gray-100 dark:bg-gray-800 rounded"></div>
            </div>
            <div className="mt-4 w-1/3 h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
        
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-primary-500 transition-colors text-sm">{resume.name || 'Untitled Document'}</h3>
          <div className="flex items-center justify-between mt-auto">
            <p className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <FiClock className="w-3 h-3" /> 
              {new Date(resume.updatedAt).toLocaleDateString()}
            </p>
            <div className="flex items-center gap-1">
              <button className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors"><FiCopy className="w-3.5 h-3.5" /></button>
              <button className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><FiTrash2 className="w-3.5 h-3.5" /></button>
              <button onClick={() => navigate('/builder', { state: { resume } })} className="p-1.5 text-primary-500 hover:text-primary-600 transition-colors"><FiEdit2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4 lg:p-10 space-y-10 min-h-screen bg-slate-50 dark:bg-gray-900 transition-colors">
      
      {/* Hero Welcome Section */}
      <section className="bg-slate-900 dark:bg-slate-950 p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/20 rounded-full blur-[120px] -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-500/10 rounded-full blur-[80px] -ml-10 -mb-10"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-[10px] font-bold uppercase tracking-widest border border-primary-500/30">AI Powered Builder</span>
              <span className="text-white/20">|</span>
              <span className="text-white/50 text-xs font-medium">Updated 5 min ago</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-3">Welcome back, <span className="text-gradient-blue">{user.name?.split(' ')[0] || 'Jane'}</span>!</h1>
            <p className="text-slate-400 max-w-lg leading-relaxed text-sm md:text-base">
              Your resume represents your future. We've updated our AI algorithms to better match current market trends. Ready to optimize?
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={() => navigate('/builder')} className="gap-2 h-14 px-8 rounded-2xl bg-black text-slate-900 hover:bg-slate-100 border-none shadow-xl shadow-white/5 font-bold">
              <FiPlus className="w-5 h-5" /> Create New
            </Button>
            <Button variant="outline" className="gap-2 h-14 px-8 rounded-2xl border-white/10 text-white hover:bg-white/5 font-bold" onClick={() => navigate('/templates')}>
              <FiLayout className="w-5 h-5" /> View Templates
            </Button>
          </div>
        </div>
      </section>

      {/* NEW 2-COLUMN CONTENT AREA */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* LEFT COLUMN (Main Content) */}
        <div className="xl:col-span-3 space-y-10">
          
          {/* Quick Actions */}
          <section>
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <FiZap className="text-amber-500" /> Quick Actions
            </h2>
            <QuickActions />
          </section>

          {/* Recent Documents Area */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <FiFileText className="text-primary-500" /> Recent Documents
              </h2>
              <button onClick={() => navigate('/resumes')} className="text-xs font-bold text-primary-600 hover:underline">View All Documents</button>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1,2,3].map(i => <div key={i} className="h-64 bg-white dark:bg-gray-800 rounded-3xl animate-pulse shadow-sm border border-gray-100 dark:border-gray-700 font-bold" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc'}}>Loading...</div>)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredResumes.map((resume, idx) => (
                  <DocumentCard key={idx} resume={resume} />
                ))}
                
                {/* Auto-fill placeholder cards if less than 3 */}
                {filteredResumes.length < 3 && 
                  [...Array(3 - filteredResumes.length)].map((_, i) => (
                    <DocumentCard key={`placeholder-${i}`} isPlaceholder={true} />
                  ))
                }
              </div>
            )}
          </section>

          {/*Recommended Templates Section */}
          <section className="bg-white dark:bg-gray-800/20 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white mb-1">Recommended Templates</h2>
                <p className="text-xs text-gray-500">Selected for your industry and experience level</p>
              </div>
              <Button variant="ghost" className="text-xs font-bold text-primary-500" onClick={() => navigate('/templates')}>Explore All</Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {[
                { name: 'Modern Pro', color: 'bg-blue-500' },
                { name: 'Executive', color: 'bg-slate-700' },
                { name: 'Creative', color: 'bg-purple-500' },
                { name: 'Minimalist', color: 'bg-gray-400' },
              ].map((template, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className={`aspect-[3/4] rounded-xl ${template.color} opacity-20 mb-3 border border-gray-200 dark:border-gray-700 relative overflow-hidden group-hover:opacity-40 transition-opacity`}>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button className="scale-75">Use</Button>
                    </div>
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-[11px] text-center">{template.name}</h4>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN (Sidebar Metrics) */}
        <div className="space-y-6">
          <ProfileCompletionCard data={profile} />
          <AISuggestionsCard />
          <StatsCard />
          <TipCard />
          
          {/* Support/Resource link */}
          <Card className="p-4 border-dashed border-gray-200 dark:border-gray-700 bg-transparent flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <FiInfo className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <span className="text-xs font-bold text-gray-500">Need Help?</span>
            </div>
            <button className="text-[10px] font-black text-primary-500 hover:underline">Contact Support</button>
          </Card>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
