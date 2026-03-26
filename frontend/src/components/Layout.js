import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col relative h-screen overflow-hidden">
        <Navbar 
          title="AI Resume Builder" 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
          isSidebarOpen={sidebarOpen} 
        />
        
        <main className="flex-1 overflow-y-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
