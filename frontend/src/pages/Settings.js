import { useState } from 'react';
import { FiMoon, FiBell, FiShield } from 'react-icons/fi';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );
  const [notifications, setNotifications] = useState(true);
  const [publicProfile, setPublicProfile] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const ToggleSwitch = ({ checked, onChange }) => (
    <div 
      onClick={onChange}
      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${checked ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}`}
    >
      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`}></div>
    </div>
  );

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto w-full">
      <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-gray-900 dark:text-white">Settings</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-10">Manage your system preferences and account settings.</p>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700 border-x-0 sm:border-x">
        <div className="p-6 md:p-8 flex items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl"><FiMoon className="w-6 h-6" /></div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Dark Mode</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Toggle dark mode appearance across the app.</p>
            </div>
          </div>
          <ToggleSwitch checked={darkMode} onChange={toggleDarkMode} />
        </div>

        <div className="p-6 md:p-8 flex items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl"><FiBell className="w-6 h-6" /></div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Email Notifications</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Receive application updates and AI analysis results.</p>
            </div>
          </div>
          <ToggleSwitch checked={notifications} onChange={() => setNotifications(!notifications)} />
        </div>

        <div className="p-6 md:p-8 flex items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl"><FiShield className="w-6 h-6" /></div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Public Profile Link</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Allow recruiters to view your active resume via link.</p>
            </div>
          </div>
          <ToggleSwitch checked={publicProfile} onChange={() => setPublicProfile(!publicProfile)} />
        </div>
      </div>
    </div>
  );
};
export default Settings;
