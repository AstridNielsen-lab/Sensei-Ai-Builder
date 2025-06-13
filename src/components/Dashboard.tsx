import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Zap, 
  Globe, 
  GitBranch, 
  TrendingUp,
  Clock,
  Users,
  Star,
  Plus,
  ArrowRight,
  Terminal as TerminalIcon
} from 'lucide-react';
import { useAIBuilder } from '../contexts/AIBuilderContext';

const Dashboard: React.FC = () => {
  const { projects, currentProject, personas, createCompleteProject } = useAIBuilder();

  const stats = [
    {
      label: 'Projetos Ativos',
      value: projects.filter(p => p.status !== 'completed').length,
      icon: <Code2 className="w-6 h-6" />,
      color: 'blue',
      change: '+12%'
    },
    {
      label: 'Deploys Hoje',
      value: projects.filter(p => p.deployUrl).length,
      icon: <Globe className="w-6 h-6" />,
      color: 'green',
      change: '+8%'
    },
    {
      label: 'Commits Automatizados',
      value: projects.length * 15,
      icon: <GitBranch className="w-6 h-6" />,
      color: 'purple',
      change: '+24%'
    },
    {
      label: 'Tempo Economizado',
      value: '48h',
      icon: <Clock className="w-6 h-6" />,
      color: 'orange',
      change: '+15%'
    }
  ];

  const recentActivity = [
    {
      type: 'terminal',
      message: 'Terminal PowerShell executou 15 comandos automaticamente',
      project: 'E-commerce App',
      time: '1 min atrás',
      status: 'success'
    },
    {
      type: 'deploy',
      message: 'Deploy automático realizado com sucesso via Vercel',
      project: 'Portfolio Website',
      time: '3 min atrás',
      status: 'success'
    },
    {
      type: 'code',
      message: 'Código React gerado e otimizado pela IA',
      project: 'Dashboard Admin',
      time: '5 min atrás',
      status: 'success'
    },
    {
      type: 'ai',
      message: 'IA Gemini processou solicitação de automação completa',
      project: 'Blog Platform',
      time: '8 min atrás',
      status: 'success'
    },
    {
      type: 'git',
      message: 'Repositório Git inicializado e primeiro commit realizado',
      project: 'Mobile App',
      time: '12 min atrás',
      status: 'success'
    }
  ];

  const getStatColor = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600'
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <motion.h1 
            className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {currentProject ? `${currentProject.name} - Overview` : 'AI Development Dashboard'}
          </motion.h1>
          <motion.p 
            className="text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.2 }}
          >
            {currentProject 
              ? `Acompanhe o progresso do seu projeto ${currentProject.language}/${currentProject.framework} com automação completa`
              : 'Plataforma de desenvolvimento automatizado com IA - Terminal PowerShell integrado e deploy automático'
            }
          </motion.p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02, duration: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${getStatColor(stat.color)} text-white`}>
                  {stat.icon}
                </div>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Atividade Recente do Terminal AI
              </h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {activity.message}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                          {activity.project}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          •
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                      ✓
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Automação Rápida
              </h3>
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    const description = prompt('Digite a descrição do projeto:', 'Landing page moderna para empresa');
                    if (description && personas.length > 0) {
                      createCompleteProject(description, 'typescript', 'react', personas[0]);
                    }
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 text-purple-600 dark:text-purple-400 hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-900/40 dark:hover:to-blue-900/40 transition-all transform hover:scale-105"
                >
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5" />
                    <span>Criar Projeto IA</span>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                <button className="w-full flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Plus className="w-5 h-5" />
                    <span>Criar Projeto AI</span>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                <button className="w-full flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5" />
                    <span>Deploy Automático</span>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                <button className="w-full flex items-center justify-between p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors">
                  <div className="flex items-center space-x-3">
                    <GitBranch className="w-5 h-5" />
                    <span>Git Automático</span>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Terminal Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.2 }}
              className="mt-6 bg-gradient-to-r from-gray-900 to-black rounded-xl p-6 text-white"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <TerminalIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold">Terminal Status</h4>
                  <p className="text-sm text-gray-300">PowerShell Ready</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Comandos Executados:</span>
                  <span className="text-green-400">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Projetos Criados:</span>
                  <span className="text-blue-400">{projects.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Deploys Realizados:</span>
                  <span className="text-purple-400">89</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Welcome Card (when no project selected) */}
        {!currentProject && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.2 }}
            className="mt-8 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 rounded-xl p-8 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">
                  Desenvolvimento Automatizado com IA + Terminal PowerShell
                </h3>
                <p className="text-blue-100 mb-4">
                  Crie sites e aplicativos completos com automação total: desde a geração de código até o deploy.
                  Nossa plataforma integra IA Gemini com terminal PowerShell nativo para máxima produtividade.
                </p>
                <div className="flex space-x-4">
                  <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                    Abrir Terminal AI
                  </button>
                  <button className="border border-white text-white px-6 py-2 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors">
                    Criar Projeto
                  </button>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
                  <TerminalIcon className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;