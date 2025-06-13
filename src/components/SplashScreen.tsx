import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [loadingStage, setLoadingStage] = useState(0);
  const [loadingText, setLoadingText] = useState('Inicializando AI Builder...');
  const [progress, setProgress] = useState(0);

  const loadingStages = [
    { text: 'Inicializando AI Builder...', duration: 200 },
    { text: 'Conectando com Gemini AI...', duration: 200 },
    { text: 'Carregando Terminal PowerShell...', duration: 200 },
    { text: 'Configurando Automação...', duration: 200 },
    { text: 'Preparando Deploy Engines...', duration: 200 },
    { text: 'Sistema Pronto!', duration: 200 }
  ];

  useEffect(() => {
    console.log(`🎬 Splash Stage ${loadingStage + 1}/${loadingStages.length}: ${loadingStages[loadingStage].text}`);
    
    const timer = setTimeout(() => {
      if (loadingStage < loadingStages.length - 1) {
        setLoadingStage(prev => prev + 1);
        setLoadingText(loadingStages[loadingStage + 1].text);
        setProgress(((loadingStage + 1) / loadingStages.length) * 100);
      } else {
        console.log('🎉 Splash Screen finalizada, chamando onComplete...');
        setTimeout(() => {
          onComplete();
        }, 400);
      }
    }, loadingStages[loadingStage].duration);

    return () => clearTimeout(timer);
  }, [loadingStage, onComplete, loadingStages]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center z-50"
      >
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-1000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        </div>

        <div className="relative z-10 text-center">
          {/* Logo Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 shadow-2xl">
              <span className="text-4xl font-bold text-white">🤖</span>
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-4xl font-bold text-white mb-2"
            >
              AI Builder
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-lg text-blue-200"
            >
              Automated Development Platform
            </motion.p>
          </motion.div>

          {/* Loading Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="space-y-6"
          >
            {/* Progress Bar */}
            <div className="w-80 mx-auto">
              <div className="bg-gray-700 rounded-full h-2 mb-4">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-blue-200 text-sm">{Math.round(progress)}% completo</p>
            </div>

            {/* Loading Text */}
            <motion.div
              key={loadingStage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-white text-lg font-medium"
            >
              {loadingText}
            </motion.div>

            {/* Loading Spinner */}
            <div className="flex justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
              />
            </div>

            {/* Features List */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="text-sm text-blue-200 space-y-1 mt-8"
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Gemini AI Integration</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>PowerShell Terminal</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Automated Deployment</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Multi-Language Support</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
        >
          <p className="text-xs text-blue-300">
            Powered by Google Gemini • Built with React & TypeScript
          </p>
          <p className="text-xs text-blue-400 mt-1">
            All Programming Languages Supported
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashScreen;

