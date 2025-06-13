import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AIBuilderProvider } from './contexts/AIBuilderContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Dashboard from './components/Dashboard';
import RealTerminal from './components/RealTerminal';

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900 mb-2">
                Oops! Algo deu errado
              </h1>
              <p className="text-gray-600 mb-4">
                Ocorreu um erro inesperado. Tente recarregar a página.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Recarregar Página
              </button>
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">
                  Detalhes do erro
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded text-red-600">
                  {this.state.error}
                </pre>
              </details>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [error, setError] = useState<string | null>(null);

  // Log inicial para debug
  useEffect(() => {
    console.log('🚀 AI Builder App carregado instantaneamente!');
    console.log('⚡ Acesso direto ao Dashboard sem delays');
  }, []);

  // Captura erros não tratados
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Unhandled error:', event.error);
      setError(event.error?.message || 'Erro desconhecido');
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      setError(event.reason?.message || 'Erro de promessa não tratada');
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);


  // Se há erro, mostra tela de erro
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Erro na Aplicação
            </h1>
            <p className="text-gray-600 mb-4">
              Ocorreu um erro. Tente recarregar a página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Recarregar
            </button>
            <pre className="mt-4 text-xs bg-gray-100 p-2 rounded text-red-600">
              {error}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AIBuilderProvider>
        <BrowserRouter>
          <Routes>
            {/* Página inicial - redireciona para dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Dashboard principal e todas as rotas levam para o mesmo dashboard */}
            <Route path="/dashboard" element={<DashboardLayout />} />
            <Route path="/index-ia" element={<DashboardLayout />} />
            <Route path="/inicial-splash-screen" element={<DashboardLayout />} />
            <Route path="/ai-builder" element={<DashboardLayout />} />
            <Route path="/builder" element={<DashboardLayout />} />
            <Route path="/home" element={<DashboardLayout />} />
            <Route path="/dev" element={<DashboardLayout />} />
            
            {/* Fallback - qualquer rota não encontrada vai para dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
        </AIBuilderProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

// Componente do layout principal do dashboard
function DashboardLayout() {
  const [showTerminal, setShowTerminal] = useState(false);
  
  return (
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
  );
}

export default App;
