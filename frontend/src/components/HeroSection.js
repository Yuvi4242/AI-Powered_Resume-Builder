import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { Button } from './ui/Button';
import TemplatePreview from './TemplatePreview';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-1/2 bg-gradient-to-br from-primary-500/5 to-transparent blur-3xl rounded-full"></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Side: Content */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-bold mb-8 border border-primary-100 dark:border-primary-800/50">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
            AI-Powered Career Growth
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8 text-gray-900 dark:text-white">
            Build Professional <br />
            <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">Resumes with AI</span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-lg leading-relaxed font-medium">
            Generate, customize, and download high-impact, ATS-optimized resumes instantly. Land your dream job twice as fast.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 mb-10">
            <Button 
              onClick={() => navigate('/signup')} 
              className="text-lg px-8 py-4 shadow-2xl shadow-primary-500/30 hover:-translate-y-1 transition-all duration-300"
            >
              Get Started Free <FiArrowRight className="ml-2" />
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => navigate('/templates')} 
              className="text-lg px-8 py-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              Explore Templates
            </Button>
          </div>
          
          {/* Trust Badges */}
          <div className="flex items-center gap-8 pt-4">
            <div className="flex flex-col">
              <span className="text-2xl font-black text-gray-900 dark:text-white">100+</span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Premium Layouts</span>
            </div>
            <div className="w-px h-10 bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-gray-900 dark:text-white">98%</span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">ATS Success Rate</span>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Visual Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative lg:block hidden"
        >
          <TemplatePreview />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
