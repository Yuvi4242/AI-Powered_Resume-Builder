import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiBell, FiMenu, FiX, FiUser, FiLogOut, FiMoon, FiSun, FiSettings } from 'react-icons/fi';
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
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 dark:bg-gray-900/90 dark:border-gray-800 px-6 py-3.5 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        
        {/* Left: Mobile Toggle & Search */}
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors lg:hidden"
          >
            {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>

          <div className="flex lg:hidden mr-2">
            <Logo className="scale-90 origin-left" />
          </div>
          
          <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 w-64 lg:w-96 transition-all focus-within:ring-2 focus-within:ring-primary-500/50 focus-within:bg-white dark:focus-within:bg-gray-900 border border-transparent focus-within:border-primary-200 dark:focus-within:border-primary-800 shadow-sm">
            <FiSearch className="text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search resumes, templates..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-gray-800 dark:text-gray-200 ml-2 w-full placeholder-gray-500"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button 
              onClick={() => { setShowNotifications(!showNotifications); setHasNewNotifications(false); }}
              className="relative p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white rounded-full transition-colors"
            >
              <FiBell size={20} />
              {hasNewNotifications && <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-red-500 shadow-sm border border-white dark:border-gray-900 rounded-full">2</span>}
            </button>
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 overflow-hidden"
                >
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                    <p className="font-semibold text-gray-900 dark:text-white">Notifications</p>
                  </div>
                  <div className="py-1 max-h-64 overflow-y-auto">
                    <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer border-b border-gray-50 dark:border-gray-700/50 transition-colors">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Resume saved</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Your latest changes to "Product Manager" were saved.</p>
                    </div>
                    <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">AI summary generated</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">We successfully optimized your summary section.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>

          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2.5 p-1 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-medium text-sm shadow-sm ring-2 ring-white dark:ring-gray-900">
                {user.name ? user.name.charAt(0).toUpperCase() : 'J'}
              </div>
              <div className="hidden sm:block text-left text-sm leading-tight">
                <p className="font-semibold text-gray-900 dark:text-white">{user.name || 'Jane Doe'}</p>
              </div>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <p className="font-medium text-gray-900 dark:text-white">{user.name || 'Jane Doe'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email || 'jane@resumecraft.ai'}</p>
                  </div>
                  <div className="py-1">
                    <button onClick={() => navigate('/profile')} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <FiUser size={16} />
                      Profile
                    </button>
                    <button onClick={() => navigate('/settings')} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <FiSettings size={16} />
                      Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
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
