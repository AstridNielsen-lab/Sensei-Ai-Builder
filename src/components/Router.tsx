import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import SplashScreen from './SplashScreen';

interface RouterProps {
  showSplash: boolean;
  onSplashComplete: () => void;
}

const AppRouter: React.FC<RouterProps> = ({ showSplash, onSplashComplete }) => {
  if (showSplash) {
    return <SplashScreen onComplete={onSplashComplete} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Página inicial - redireciona para dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Splash Screen com nome */}
        <Route path="/inicial-splash-screen" element={<SplashScreen onComplete={onSplashComplete} />} />
        
        {/* Dashboard principal */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/index-ia" element={<Dashboard />} />
        
        {/* Rotas alternativas */}
        <Route path="/ai-builder" element={<Dashboard />} />
        <Route path="/builder" element={<Dashboard />} />
        <Route path="/home" element={<Dashboard />} />
        
        {/* Rota para desenvolvimento */}
        <Route path="/dev" element={<Dashboard />} />
        
        {/* Fallback - qualquer rota não encontrada vai para dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

