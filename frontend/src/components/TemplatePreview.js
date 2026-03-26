import React from 'react';
import { motion } from 'framer-motion';

const MiniCard = ({ delay = 0, rotate = 0, y = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, rotate: rotate - 10 }}
    animate={{ 
      opacity: 1, 
      scale: 1, 
      rotate: rotate,
      y: [y, y - 20, y]
    }}
    transition={{
      opacity: { duration: 0.5, delay },
      scale: { duration: 0.5, delay },
      rotate: { duration: 0.5, delay },
      y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay }
    }}
    className={`absolute w-48 h-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-4 ${className}`}
  >
    {/* Abstract Resume Content */}
    <div className="w-1/2 h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
    <div className="space-y-2">
      <div className="w-full h-2 bg-gray-100 dark:bg-gray-700/50 rounded"></div>
      <div className="w-4/5 h-2 bg-gray-100 dark:bg-gray-700/50 rounded"></div>
      <div className="w-full h-8 bg-primary-50 dark:bg-primary-900/20 rounded-lg mt-4"></div>
    </div>
    <div className="mt-8 space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex gap-2 items-center">
          <div className="w-3 h-3 rounded-full bg-accent-100 dark:bg-accent-900/30"></div>
          <div className="flex-1 h-2 bg-gray-50 dark:bg-gray-700/30 rounded"></div>
        </div>
      ))}
    </div>
    
    {/* Hover Overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
  </motion.div>
);

const TemplatePreview = () => {
  return (
    <div className="relative w-full h-[450px] flex items-center justify-center overflow-visible">
      {/* Animated Background Gradients */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute w-72 h-72 bg-primary-500/20 blur-[100px] rounded-full top-10 right-10"
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute w-72 h-72 bg-accent-500/20 blur-[100px] rounded-full bottom-10 left-10"
      />

      {/* Floating Cards */}
      <div className="relative w-full h-full">
        <MiniCard 
          delay={0.2} 
          rotate={-12} 
          y={40} 
          className="left-[10%] top-10 border-primary-500/30 ring-4 ring-primary-500/5" 
        />
        <MiniCard 
          delay={0.4} 
          rotate={5} 
          y={0} 
          className="left-[35%] top-20 z-10 border-accent-500/30 shadow-primary-500/10" 
        />
        <MiniCard 
          delay={0.6} 
          rotate={15} 
          y={80} 
          className="left-[60%] top-10 border-purple-500/30" 
        />
      </div>

      {/* Glass Overlay Tag */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl px-6 py-3 rounded-2xl shadow-2xl border border-white/50 dark:border-gray-700 flex items-center gap-3 z-20"
      >
        <div className="flex -space-x-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 overflow-hidden shadow-sm">
              <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" />
            </div>
          ))}
        </div>
        <p className="text-sm font-bold text-gray-900 dark:text-white">
          Used by <span className="text-primary-600">5k+</span> developers
        </p>
      </motion.div>
    </div>
  );
};

export default TemplatePreview;
