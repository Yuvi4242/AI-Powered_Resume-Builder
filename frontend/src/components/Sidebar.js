import { AnimatePresence, motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FiHome, 
  FiFileText, 
  FiLayout, 
  FiSettings, 
  FiZap,
  FiPlus,
  FiUser,
  FiInfo,
  FiLogOut,
  FiGrid,
  FiBookOpen
} from 'react-icons/fi';
import { removeToken } from '../utils/api';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  const menuItems = [
    { path: '/', label: 'Home', icon: FiHome },
    { path: '/dashboard', label: 'Dashboard', icon: FiLayout },
    { path: '/builder', label: 'Create Resume', icon: FiPlus },
    { path: '/templates', label: 'Templates', icon: FiGrid },
    { path: '/ai-tools', label: 'AI Tools', icon: FiZap },
    { path: '/resumes', label: 'My Resumes', icon: FiFileText },
    { path: '/profile', label: 'Profile', icon: FiUser },
    { path: '/settings', label: 'Settings', icon: FiSettings },
    { path: '/resources', label: 'Resources', icon: FiBookOpen },
    { path: '/about', label: 'About', icon: FiInfo },
  ];

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
          <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg leading-none">AI</span>
            </div>
            <span className="text-lg font-bold tracking-tight">AI Resume <span className="text-primary-600">Builder</span></span>
          </motion.div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 mt-2">Main Menu</p>
          
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group text-sm font-medium ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-gray-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-1">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group">
            <FiLogOut className="w-4 h-4 text-red-500 group-hover:text-red-700" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
