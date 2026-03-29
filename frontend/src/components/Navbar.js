import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiBell, FiMenu, FiX, FiUser, FiLogOut, FiMoon, FiSun, FiSettings, FiActivity, FiChevronDown } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { removeToken } from '../utils/api';
import { useSearch } from '../context/SearchContext';
import Logo from './Logo';

const Navbar = ({ title, onMenuToggle, isSidebarOpen }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(true);
  const { searchQuery, setSearchQuery } = useSearch();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 inset-x-0 h-20 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 z-50 transition-all duration-300">
      <div className="max-w-[1500px] mx-auto h-full px-6 flex items-center justify-between">
        
        {/* Left: Mobile Toggle & Branding/Search */}
        <div className="flex items-center gap-8 flex-1">
          <div className="flex items-center gap-4">
             <button
                onClick={onMenuToggle}
                className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all lg:hidden"
             >
                {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
             </button>
             <Logo className="hidden lg:block shrink-0" />
          </div>
          
          <div className="hidden md:flex items-center bg-slate-100/50 dark:bg-slate-800/40 rounded-2xl px-4 py-2.5 w-64 lg:w-[400px] transition-all focus-within:bg-white dark:focus-within:bg-slate-900 border border-transparent focus-within:border-primary-500/30 shadow-sm group">
            <FiSearch className="text-slate-400 w-4 h-4 group-focus-within:text-primary-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search resumes, templates or tools..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-xs font-bold text-slate-800 dark:text-slate-200 ml-3 w-full placeholder-slate-400 uppercase tracking-widest"
            />
          </div>
        </div>

        {/* Right: Actions & Tools */}
        <div className="flex items-center gap-2 lg:gap-5">
          
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button 
              onClick={() => { setShowNotifications(!showNotifications); setHasNewNotifications(false); }}
              className={`relative p-3 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all ${showNotifications ? 'bg-slate-100 dark:bg-slate-800 text-primary-500' : ''}`}
            >
              <FiBell size={20} />
              {hasNewNotifications && (
                <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                </span>
              )}
            </button>
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 mt-4 w-80 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-2 z-50"
                >
                  <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Activity Stream</p>
                    <span className="text-[10px] text-primary-500 font-bold hover:underline cursor-pointer">Mark all read</span>
                  </div>
                  <div className="py-2 max-h-80 overflow-y-auto custom-scrollbar">
                    <div className="px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer rounded-2xl transition-all group">
                      <div className="flex gap-3">
                         <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-lg h-fit group-hover:scale-110 transition-transform"><FiActivity className="w-4 h-4" /></div>
                         <div>
                            <p className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-tight">System Update</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium leading-relaxed">Your "Product Manager" resume was successfully synced to the cloud.</p>
                         </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-3 text-slate-500 hover:text-primary-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all"
          >
            {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>

          <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 hidden sm:block mx-1"></div>

          {/* Profile Quick Profile Navigation */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className={`flex items-center gap-3 pl-1.5 pr-3 py-1.5 rounded-2xl transition-all border ${showProfile ? 'border-primary-500/30 bg-primary-50/10' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-xl shadow-primary-500/20 ring-2 ring-white dark:ring-slate-900">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden sm:flex flex-col items-start leading-none gap-1">
                 <span className="text-xs font-bold text-slate-900 dark:text-white">{(user.name || 'User').split(' ')[0]}</span>
                 <span className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-400">Pro Tier</span>
              </div>
              <FiChevronDown className={`w-3 h-3 text-slate-300 transition-transform duration-300 ${showProfile ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence mode="wait">
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 mt-4 w-60 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-2 z-50 overflow-hidden"
                >
                  <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">User Menu</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.email || 'user@resumecraft.ai'}</p>
                  </div>
                  <div className="py-2 space-y-1">
                    {[
                      { icon: FiUser, label: 'Profile Settings', path: '/profile' },
                      { icon: FiSettings, label: 'Preferences', path: '/settings' },
                    ].map((item, i) => (
                      <button 
                        key={i}
                        onClick={() => { navigate(item.path); setShowProfile(false); }} 
                        className="w-full flex items-center gap-3 px-5 py-3 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-primary-600 rounded-2xl transition-all"
                      >
                        <item.icon size={16} />
                        {item.label}
                      </button>
                    ))}
                    
                    <div className="border-t border-slate-100 dark:border-slate-800 my-2"></div>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-5 py-3 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-2xl transition-all"
                    >
                      <FiLogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
      </div>
    </nav>
  );
};

export default Navbar;
