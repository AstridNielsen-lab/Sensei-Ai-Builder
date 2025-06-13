import React, { useState, useEffect } from 'react';

function Dashboard() {
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Bom dia! ☀️');
    } else if (hour < 18) {
      setGreeting('Boa tarde! 🌤️');
    } else {
      setGreeting('Boa noite! 🌙');
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const quickActions = [
    {
      icon: '💻',
      title: 'Novo Projeto React',
      description: 'Criar projeto React + TypeScript',
      action: () => alert('Criar projeto React'),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '🚀',
      title: 'Deploy Rápido',
      description: 'Deploy automático via Vercel',
      action: () => alert('Deploy iniciado'),
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: '🔧',
      title: 'Git Clone',
      description: 'Clonar repositório existente',
      action: () => alert('Git clone'),
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: '📦',
      title: 'Instalar Deps',
      description: 'npm install automático',
      action: () => alert('Installing dependencies'),
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {greeting}
            </h1>
            <p className="text-gray-600">
              Bem-vindo ao AI Builder. O que vamos construir hoje?
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono text-gray-900">
              {currentTime.toLocaleTimeString()}
            </div>
            <div className="text-sm text-gray-500">
              {currentTime.toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickActions.map((action, index) => (
          <div
            key={index}
            onClick={action.action}
            className="group cursor-pointer bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-200 hover:scale-105"
          >
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform text-2xl`}>
              {action.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {action.title}
            </h3>
            <p className="text-gray-600 text-sm">
              {action.description}
            </p>
          </div>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Projetos Ativos
              </h3>
              <p className="text-3xl font-bold text-blue-600">5</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
              💻
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Deploys Hoje
              </h3>
              <p className="text-3xl font-bold text-green-600">3</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
              🚀
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Commits
              </h3>
              <p className="text-3xl font-bold text-purple-600">12</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl">
              🔧
            </div>
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Projetos Recentes
        </h3>
        <div className="space-y-3">
          {[
            { name: 'E-commerce App', framework: 'React + TypeScript', status: 'Ativo' },
            { name: 'Portfolio Site', framework: 'Next.js', status: 'Deploy' },
            { name: 'API Gateway', framework: 'Node.js + Express', status: 'Teste' }
          ].map((project, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                  {project.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {project.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {project.framework} • Criado há 2 dias
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full">
                  {project.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coffee break encouragement */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
        <div className="flex items-center space-x-3">
          <span className="text-4xl">☕</span>
          <div>
            <h3 className="text-lg font-semibold text-amber-900">
              Dica do AI Builder
            </h3>
            <p className="text-amber-700">
              Lembre-se de fazer pausas regulares! A criatividade flui melhor com uma mente descansada. ☕
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

