import React, { useState, useEffect } from 'react';
import { AIBuilderProvider } from './contexts/AIBuilderContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Dashboard from './components/Dashboard';
import SplashScreen from './components/SplashScreen';
import RealTerminal from './components/RealTerminal';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showTerminal, setShowTerminal] = useState(false);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <ThemeProvider>
      <AIBuilderProvider>
        {showSplash ? (
          <SplashScreen onComplete={handleSplashComplete} />
        ) : (
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            {/* Header do AI Builder */}
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg font-bold">🤖</span>
                    </div>
                    <div>
                      <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                        AI Builder
                      </h1>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Powered by Gemini AI • Automated Development Platform
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setShowTerminal(!showTerminal)}
                      className="flex items-center space-x-2 px-3 py-1 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      💻 <span>Terminal</span>
                    </button>
                    <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center space-x-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span>IA Ativa</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        🚀 <span>Auto Deploy</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        💻 <span>PowerShell Ready</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </header>
            
            {/* Terminal Flutuante */}
            {showTerminal && (
              <div className="fixed bottom-4 right-4 w-1/2 z-40">
                <RealTerminal 
                  className="shadow-2xl" 
                  height="h-80"
                />
              </div>
            )}
            
            {/* Dashboard principal */}
            <main className="flex-1 relative">
              <Dashboard />
            </main>
            
            {/* Footer */}
            <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-4">
                    <span>© 2024 AI Builder</span>
                    <span>•</span>
                    <span>Powered by Google Gemini</span>
                    <span>•</span>
                    <span>Deploy via Vercel</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span>All Programming Languages Supported</span>
                    <span>•</span>
                    <span>Automated Development with PowerShell</span>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        )}
      </AIBuilderProvider>
    </ThemeProvider>
  );
}

export default App;