import { FiCheckCircle, FiCode, FiCpu, FiAward } from 'react-icons/fi';

const About = () => {
  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto w-full">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl mx-auto shadow-xl shadow-primary-500/30 mb-6 tracking-tighter">AI</div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-white">AI Resume Builder</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">Version 2.0.1 (Stable Build)</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 md:p-10 mb-8 border-x-0 sm:border-x">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">About the Platform</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          AI Resume Builder is a next-generation SaaS workspace designed to eliminate the friction from job applications. By combining industry-standard ATS design rules with native LLM generation, we ensure candidates showcase their best possible selves to recruiters. 
        </p>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Core Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {['Gemini-Powered Smart Summaries', 'Role-based Action Bullets', 'ATS Formatting Optimization', 'Dynamic Styling Templates', 'Instant PDF/Live Export', 'Skill Match Validations'].map((feature, i) => (
            <div key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium">
              <FiCheckCircle className="text-primary-500 shrink-0" /> {feature}
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-100 dark:border-gray-700 pt-8 mt-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
            <FiCpu className="w-6 h-6 text-primary-500 mx-auto mb-3" />
            <p className="font-bold text-gray-900 dark:text-white text-sm">LLM Engine</p>
            <p className="text-xs text-gray-500">Gemini Pro API</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
            <FiCode className="w-6 h-6 text-primary-500 mx-auto mb-3" />
            <p className="font-bold text-gray-900 dark:text-white text-sm">Stack</p>
            <p className="text-xs text-gray-500">MERN + Tailwind</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
            <FiAward className="w-6 h-6 text-primary-500 mx-auto mb-3" />
            <p className="font-bold text-gray-900 dark:text-white text-sm">Developer</p>
            <p className="text-xs text-gray-500">ResumeCraft Tech</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default About;
