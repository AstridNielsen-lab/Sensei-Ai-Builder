import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import { ProjectProvider } from './contexts/ProjectContext';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <ThemeProvider>
      <ProjectProvider>
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <Sidebar 
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
          
          <motion.main 
            className={`flex-1 transition-all duration-300 ${
              sidebarCollapsed ? 'ml-16' : 'ml-80'
            }`}
            animate={{ marginLeft: sidebarCollapsed ? 64 : 320 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <MainContent />
          </motion.main>
          
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1f2937',
                color: '#f9fafb',
                border: '1px solid #374151',
              },
            }}
          />
        </div>
      </ProjectProvider>
    </ThemeProvider>
  );
}

export default App;