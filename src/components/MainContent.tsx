import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useProject } from '../contexts/ProjectContext';
import Dashboard from './Dashboard';
import ProjectWorkspace from './ProjectWorkspace';
import AIChat from './AIChat';

const MainContent: React.FC = () => {
  const { currentProject } = useProject();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'workspace' | 'chat'>('dashboard');

  if (!currentProject) {
    return <Dashboard />;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex space-x-8 px-6">
          {[
            { id: 'workspace', label: 'Workspace', icon: '🏗️' },
            { id: 'chat', label: 'AI Assistant', icon: '🤖' },
            { id: 'dashboard', label: 'Overview', icon: '📊' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'workspace' && <ProjectWorkspace />}
          {activeTab === 'chat' && <AIChat />}
        </motion.div>
      </div>
    </div>
  );
};

export default MainContent;