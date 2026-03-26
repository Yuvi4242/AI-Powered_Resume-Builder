import { FiCheckCircle } from 'react-icons/fi';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

const TemplateCard = ({ template, onUse }) => {
  return (
    <Card className="h-[420px] flex flex-col group overflow-hidden border-2 border-transparent hover:border-primary-500/30 transition-all bg-white dark:bg-gray-800">
      
      {/* Preview Image View */}
      <div className="flex-1 bg-gray-100 dark:bg-gray-900 overflow-hidden relative">
        <img 
          src={template.preview || 'https://placehold.co/300x400/e2e8f0/64748b?text=Template+Preview'} 
          alt={template.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Usage indicator */}
        <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-full px-2 py-1 flex items-center gap-1.5 shadow-sm border border-gray-200 dark:border-gray-700 z-20">
          <FiCheckCircle className="w-3 h-3 text-green-500" />
          <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">{template.users || '10k+'}</span>
        </div>
      </div>

      {/* Info & Action Block */}
      <div className="p-5 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg line-clamp-1">{template.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded">
                {template.experienceLevel}
              </span>
              {template.tags?.includes('ATS') && (
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded flex items-center gap-1">
                  <FiCheckCircle className="w-2.5 h-2.5" /> ATS
                </span>
              )}
            </div>
          </div>
        </div>
        <Button 
          onClick={() => onUse(template)} 
          className="w-full justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors"
          variant="secondary"
        >
          Use Template
        </Button>
      </div>
    </Card>
  );
};

export default TemplateCard;
