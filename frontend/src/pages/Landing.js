import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiZap, FiCheckCircle, FiShare2, FiStar, FiArrowRight, FiCheck } from 'react-icons/fi';
import { Button } from '../components/ui/Button';
import Footer from '../components/Footer';
import Logo from '../components/Logo';
import HeroSection from '../components/HeroSection';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    { icon: FiZap, title: 'AI Writing Assistant', desc: 'Generate professional summaries and impact-driven bullet points instantly.' },
    { icon: FiCheckCircle, title: 'ATS Templates', desc: 'Ensure your resume passes Applicant Tracking Systems formats.' },
    { icon: FiShare2, title: 'Export & Share', desc: 'Download as PDF or share a live link with recruiters in one click.' }
  ];

  const steps = [
    { num: '01', title: 'Import or Start Fresh', desc: 'Upload your LinkedIn data or build from completely scratch.' },
    { num: '02', title: 'Edit & Optimize', desc: 'Use AI to rewrite bullets and optimize for ATS algorithms.' },
    { num: '03', title: 'Export & Apply', desc: 'Download your polished resume and land more interviews.' }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans selection:bg-primary-100 selection:text-primary-900 overflow-x-hidden">
      
      {/* Navbar Minimal Route */}
      <nav className="fixed top-0 inset-x-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
            <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
            <a href="#templates" className="hover:text-primary-600 transition-colors">Templates</a>
            <a href="#pricing" className="hover:text-primary-600 transition-colors">Pricing</a>
            <button onClick={() => navigate('/resources')} className="hover:text-primary-600 transition-colors cursor-pointer">Resources</button>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/login')} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              Sign In
            </button>
            <Button onClick={() => navigate('/signup')} variant="primary" className="text-sm px-4 py-2">
              Get Started — It's free
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Header Space */}
      <HeroSection />

      {/* Metrics Counter Section */}
      <section className="border-y border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-700 text-center">
          <div>
            <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">70%</h3>
            <p className="text-gray-500 font-medium">Faster resume creation</p>
          </div>
          <div>
            <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">+40%</h3>
            <p className="text-gray-500 font-medium">More interview callbacks</p>
          </div>
          <div>
            <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2 flex justify-center items-center gap-2">4.8/5 <FiStar className="text-amber-400 fill-amber-400 w-6 h-6" /></h3>
            <p className="text-gray-500 font-medium">Average user rating</p>
          </div>
        </div>
      </section>

      {/* Features Outline Matrix */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Everything you need to succeed</h2>
          <p className="text-gray-600 dark:text-gray-400">Stop wrestling with formatting and writer's block. ResumeCraft handles the heavy lifting.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div key={i} whileHover={{ y: -5 }} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 text-primary-600 rounded-xl flex items-center justify-center mb-6">
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mechanics Explanation View */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-gray-100 dark:border-gray-800">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How it works</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-8 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-gray-200 via-primary-300 to-gray-200 dark:from-gray-700 dark:via-primary-800 dark:to-gray-700 z-0"></div>
          {steps.map((s, i) => (
            <div key={i} className="relative z-10 text-center">
              <div className="w-16 h-16 mx-auto bg-white dark:bg-gray-900 border-4 border-gray-50 dark:border-gray-800 shadow-xl rounded-full flex items-center justify-center text-xl font-black text-primary-600 mb-6">
                {s.num}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{s.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Cards */}
      <section id="pricing" className="bg-gray-50 dark:bg-gray-800/50 py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Simple, transparent pricing</h2>
            <p className="text-gray-600 dark:text-gray-400">Start for free, upgrade when you need more power.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Free</h3>
              <p className="text-gray-500 mb-6">Perfect for getting started.</p>
              <div className="text-4xl font-black text-gray-900 dark:text-white mb-8">$0 <span className="text-lg text-gray-500 font-medium">/ forever</span></div>
              <ul className="space-y-4 mb-8">
                {['1 Resume', 'Standard Templates', 'Basic PDF Export', '7 Days AI Trial'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <FiCheck className="text-primary-500" /> {f}
                  </li>
                ))}
              </ul>
              <Button variant="secondary" className="w-full justify-center">Current Plan</Button>
            </div>

            {/* Pro Tier Block */}
            <div className="bg-gray-900 dark:bg-gray-800 p-8 rounded-3xl shadow-2xl shadow-primary-500/20 border border-gray-800 dark:border-primary-500/30 relative overflow-hidden transform md:-translate-y-4">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary-500 to-accent-500"></div>
              <div className="absolute top-6 right-6 px-3 py-1 bg-primary-500 text-white text-xs font-bold rounded-full uppercase tracking-wider">Most Popular</div>
              
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <p className="text-gray-400 mb-6">For serious job seekers.</p>
              <div className="text-4xl font-black text-white mb-8">$12 <span className="text-lg text-gray-400 font-medium">/ month</span></div>
              <ul className="space-y-4 mb-8">
                {['Unlimited Resumes', 'Premium Templates', 'Unlimited AI Generations', 'Advanced Formats (Word)', 'Cover Letter Builder'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <FiCheck className="text-primary-400" /> {f}
                  </li>
                ))}
              </ul>
              <Button variant="primary" className="w-full justify-center text-white bg-primary-600 hover:bg-primary-500">Upgrade to Pro</Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
