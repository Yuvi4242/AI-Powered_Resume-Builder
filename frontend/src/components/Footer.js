import React from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaGithub, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: FaLinkedin, url: 'https://linkedin.com/in/yuvi42', color: 'hover:text-[#0077B5]' },
    { icon: FaGithub, url: 'https://github.com/yuvi4242', color: 'hover:text-[#333]' },
    { icon: FaInstagram, url: 'https://instagram.com/yuvraj_42_', color: 'hover:text-[#E4405F]' },
    { icon: FaWhatsapp, url: 'https://wa.me/+916353768151', color: 'hover:text-[#25D366]' },
  ];

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Templates', path: '/templates' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <footer className="relative bg-gray-900 text-white pt-16 pb-8 px-6 overflow-hidden">
      {/* Glassmorphism Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-500 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* LEFT: Brand & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-lg text-white font-bold text-lg">R</div>
              <span className="text-2xl font-bold tracking-tight">AI Resume <span className="text-primary-500">Builder</span></span>
            </div>
            <p className="text-gray-400 max-w-sm leading-relaxed">
              Build professional, ATS-optimized resumes effortlessly using our advanced AI technology. Land your dream job faster with ResumeCraft.
            </p>
          </div>

          {/* CENTER: Navigation Links */}
          <div className="md:text-center">
            <h3 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Quick Links</h3>
            <ul className="grid grid-cols-2 md:grid-cols-1 gap-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.path} 
                    className="text-gray-400 hover:text-primary-500 transition-all duration-300 hover:translate-x-1 md:hover:translate-x-0 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT: Social Connect */}
          <div className="md:text-right">
            <h3 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Connect With Me</h3>
            <div className="flex items-center md:justify-end gap-4">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-11 h-11 bg-gray-800 rounded-xl flex items-center justify-center text-xl transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary-500/20 border border-gray-700 ${social.color}`}
                >
                  <social.icon />
                </a>
              ))}
            </div>
            <p className="mt-6 text-sm text-gray-500">
              Follow me for updates and tips.
            </p>
          </div>
        </div>

        {/* Divider Line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-8"></div>

        {/* BOTTOM SECTION: Copyright & Attribution */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {currentYear} AI Resume Builder. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <span className="text-red-500 animate-pulse text-lg">⚡︎</span> by <span className="font-bold text-gray-300">Alpha</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
