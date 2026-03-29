import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiZap, FiCheckCircle, FiStar, FiArrowRight, FiShield, FiCpu, FiLayout, FiActivity } from 'react-icons/fi';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import Footer from '../components/Footer';
import Logo from '../components/Logo';
import HeroSection from '../components/HeroSection';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    { 
      icon: FiCpu, 
      title: 'AI Resume Engine', 
      desc: 'Craft high-impact sections powered by industry-leading LLMs optimized for career success.',
      color: 'text-blue-500'
    },
    { 
      icon: FiLayout, 
      title: 'Premium ATS Layouts', 
      desc: 'Sleek, recruiter-tested templates designed to slice through complex ATS filters effortlessly.',
      color: 'text-indigo-500'
    },
    { 
      icon: FiActivity, 
      title: 'Real-time ATS Scoring', 
      desc: 'Get instant feedback on your resume strength and deep scan analysis to beat the competition.',
      color: 'text-emerald-500'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-primary-100 selection:text-primary-900 overflow-x-hidden">
      
      {/* Premium Navbar */}
      <nav className="fixed top-0 inset-x-0 bg-white/70 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo />
          
          <div className="hidden md:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
            <a href="#about" className="hover:text-primary-600 transition-colors">About</a>
            <button onClick={() => navigate('/resources')} className="hover:text-primary-600 transition-colors">Resources</button>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/login')} 
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300 hover:text-primary-500 transition-colors"
            >
              Sign In
            </button>
            <Button 
              size="sm"
              onClick={() => navigate('/signup')} 
            >
              Sign Up Free
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Header Space */}
      <HeroSection />

      {/* Social Proof / Metrics Section */}
      <section className="py-16 bg-white/50 dark:bg-slate-900/20 border-y border-slate-200/50 dark:border-slate-800/50 relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { label: 'Active Users', value: '100K+', icon: FiZap },
            { label: 'Success Rate', value: '98.4%', icon: FiCheckCircle },
            { label: 'ATS Templates', value: '150+', icon: FiStar },
            { label: 'User Rating', value: '4.9/5', icon: FiActivity },
          ].map((stat, i) => (
            <div key={i} className="text-center group transition-all duration-300 hover:scale-105">
              <h3 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors">{stat.value}</h3>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Matrix */}
      <section id="features" className="py-32 px-6 max-w-7xl mx-auto relative">
         {/* Decoration */}
        <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-primary-500/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="text-center max-w-3xl mx-auto mb-24">
          <h2 className="mb-6 tracking-tight">The only resume platform <br /> you'll <span className="text-gradient">ever need.</span></h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">We combined advanced AI with deep recruiter psychology to build the most effective hiring tool on the market. Land interviews, not just applications.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((f, i) => (
            <Card key={i} hoverable className="p-10 !bg-white dark:!bg-slate-900/40 relative overflow-hidden group">
              <div className={`w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-10 transition-all duration-500 group-hover:scale-110 group-hover:bg-primary-500 group-hover:text-white shadow-sm border border-slate-100 dark:border-slate-800`}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{f.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-slate-950 dark:bg-slate-900/40 overflow-hidden relative border-t border-slate-800/50">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-[-10%] w-1/3 h-full bg-indigo-600/10 blur-[100px] rounded-full"></div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-white mb-8 !leading-[1.1]">Ready to land your next <br /> <span className="text-primary-400 underline decoration-primary-400/30 decoration-8 underline-offset-8">career upgrade?</span></h2>
          <p className="text-slate-400 text-xl mb-12 font-medium max-w-2xl mx-auto">Join 100,000+ professionals who beat the odds and skipped the line to their dream roles using our platform.</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button 
              size="lg" 
              onClick={() => navigate('/signup')}
              className="shadow-2xl shadow-primary-500/50 min-w-[220px]"
            >
              Start Building Now
            </Button>
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/templates')}>
                <span className="text-white font-bold text-sm border-b border-white/20 group-hover:border-white transition-all">View Premium Templates</span>
                <FiArrowRight className="text-white group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div className="mt-16 flex items-center justify-center gap-8 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-500">
             <FiShield className="text-white w-6 h-6" />
             <span className="text-white text-[10px] font-bold uppercase tracking-[0.2em]">100% Privacy Secured</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
