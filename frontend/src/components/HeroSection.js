import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiShield } from 'react-icons/fi';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';

const HeroSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative pt-32 pb-24 px-6 max-w-7xl mx-auto overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-500/10 blur-[120px] rounded-full -z-10 animate-pulse"></div>
      <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-indigo-500/10 blur-[100px] rounded-full -z-10"></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* Left Side: Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold mb-10 shadow-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-ping"></span>
            <span className="uppercase tracking-[0.2em]">Next-Gen Resume Intelligence</span>
          </motion.div>
          
          <h1 className="mb-8 !leading-[1.05]">
            Craft your <span className="text-gradient">Career Edge</span> <br />
            with AI Precision
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-lg leading-relaxed font-medium">
            Stop generic applications. Generate, optimize, and export high-impact resumes that score <span className="font-bold text-slate-900 dark:text-white underline decoration-primary-500/40 decoration-4 underline-offset-4">98%+ on ATS tests</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 mb-14">
            <Button 
              size="lg"
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')} 
              className="group"
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Start Building Free'} 
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => navigate('/templates')} 
            >
              Explore Templates
            </Button>
          </div>
          
          {/* Hero Trust Indicators */}
          <div className="flex items-center gap-10 opacity-70">
            <div className="flex flex-col">
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">100+</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Premium Layouts</span>
            </div>
            <div className="w-px h-8 bg-slate-200 dark:bg-slate-800"></div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">98%</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ATS Success Rate</span>
            </div>
            <div className="w-px h-8 bg-slate-200 dark:bg-slate-800"></div>
            <div className="flex items-center gap-2">
              <FiShield className="text-emerald-500 w-5 h-5" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">GDPR Secure & Private</span>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Premium Dashboard Mockup / Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="relative lg:block hidden group"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 to-indigo-500/20 rounded-[2.5rem] blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
          <div className="relative rounded-[2rem] border border-slate-200/50 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl shadow-2xl overflow-hidden animate-float">
            <div className="h-8 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200/50 dark:border-slate-800 flex items-center px-4 gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1470&auto=format&fit=crop" 
              alt="Resume Dashboard Preview" 
              className="w-full h-auto opacity-90 group-hover:opacity-100 transition-opacity duration-500"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
