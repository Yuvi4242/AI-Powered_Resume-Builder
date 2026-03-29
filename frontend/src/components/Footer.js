import React from 'react';
import { Link } from 'react-router-dom';
import { FiLinkedin, FiGithub, FiInstagram, FiTwitter, FiHeart, FiZap } from 'react-icons/fi';
import Logo from './Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: FiLinkedin, url: 'https://linkedin.com/in/yuvi42', color: 'hover:text-[#0077B5]' },
    { icon: FiGithub, url: 'https://github.com/yuvi4242', color: 'hover:text-white' },
    { icon: FiInstagram, url: 'https://instagram.com/yuvraj_42_', color: 'hover:text-[#E4405F]' },
    { icon: FiTwitter, url: 'https://twitter.com', color: 'hover:text-[#1DA1F2]' },
  ];

  const sections = [
    {
      title: 'Platform',
      links: [
        { label: 'AI Builder', path: '/builder' },
        { label: 'Templates', path: '/templates' },
        { label: 'ATS Scanner', path: '/dashboard' },
        { label: 'Pricing', path: '#' },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', path: '/about' },
        { label: 'Success Stories', path: '#' },
        { label: 'Privacy Policy', path: '#' },
        { label: 'Contact', path: '/contact' },
      ]
    }
  ];

  return (
    <footer className="relative bg-slate-950 text-white pt-24 pb-12 px-6 overflow-hidden border-t border-slate-900">
      {/* Premium Background Atmosphere */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-5%] w-[30%] h-[50%] bg-primary-600/30 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-[1500px] mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* LEFT: Brand Intelligence */}
          <div className="lg:col-span-2 space-y-8">
            <Logo />
            <p className="text-slate-400 max-w-sm text-sm font-medium leading-relaxed">
              Empowering 100,000+ professionals to bypass generic applications and land their dream roles using recruiter-calibrated AI intelligence.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-lg text-slate-400 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-primary-500/20 ${social.color}`}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* MIDDLE: Links Arrays */}
          {sections.map((section, i) => (
            <div key={i}>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-8">{section.title}</h3>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link 
                        to={link.path} 
                        className="text-xs font-bold text-slate-500 hover:text-primary-400 transition-all duration-300 flex items-center group"
                      >
                        <span className="w-0 group-hover:w-2 h-px bg-primary-500 mr-0 group-hover:mr-2 transition-all"></span>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
            </div>
          ))}
        </div>

        {/* Divider Line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-800 to-transparent mb-12"></div>

        {/* BOTTOM SECTION: Attribution Feed */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
             <p>© {currentYear} ResumeCraft AI</p>
             <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-slate-800"></span>
             <p className="flex items-center gap-2">
                <FiZap className="text-primary-500" /> System: Stable v4.2.0
             </p>
          </div>
          
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
             Made with <FiHeart className="text-rose-500 fill-rose-500 animate-pulse" /> by 
             <span className="text-white hover:text-primary-500 transition-colors cursor-pointer">Alpha</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
