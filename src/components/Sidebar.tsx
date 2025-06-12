import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, 
  FolderOpen, 
  Settings, 
  User, 
  Zap, 
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Plus
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useProject } from '../contexts/ProjectContext';
import ProjectList from './ProjectList';
import PersonaSelector from './PersonaSelector';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const { theme, toggleTheme } = useTheme();
  const { projects, addProject } = useProject();

  const createNewProject = () => {
    const name = prompt('Nome do projeto:');
    if (!name) return;
    
    const description = prompt('Descrição do projeto:') || '';
    const language = prompt('Linguagem principal (ex: TypeScript, Python, etc.):') || 'TypeScript';
    const framework = prompt('Framework (ex: React, Vue, Next.js, etc.):') || 'React';
    
    addProject({
      name,
      description,
      language,
      framework,
      status: 'planning',
      files: []
    });
  };

  return (
    <motion.aside 
      className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg z-50 ${
        collapsed ? 'w-16' : 'w-80'
      }`}
      animate={{ width: collapsed ? 64 : 320 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && (
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              AI Builder
            </h1>
          </motion.div>
        )}
        
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        {!collapsed ? (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
                Ações Rápidas
              </h3>
              <button
                onClick={createNewProject}
                className="w-full flex items-center space-x-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Novo Projeto</span>
              </button>
            </div>

            {/* Projects List */}
            <ProjectList />

            {/* Persona Selector */}
            <PersonaSelector />
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={createNewProject}
              className="w-full p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
              title="Novo Projeto"
            >
              <Plus className="w-5 h-5 mx-auto" />
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className={`flex ${collapsed ? 'flex-col space-y-2' : 'items-center justify-between'}`}>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
          
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;