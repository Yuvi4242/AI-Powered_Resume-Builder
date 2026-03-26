import React from 'react';
import { FiZap } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Logo = ({ className = "" }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate('/')} 
      className={`flex items-center gap-2 cursor-pointer group ${className}`}
    >
      <div className="relative">
        <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform duration-300">
          <FiZap className="text-white text-xl fill-white/20" />
        </div>
        {/* Sparkle Decoration */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-400 rounded-full blur-[2px] animate-pulse"></div>
      </div>
      
      <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
        Resume<span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">AI</span>
      </span>
    </div>
  );
};

export default Logo;
