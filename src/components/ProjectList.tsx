import React from 'react';
import { motion } from 'framer-motion';
import { FolderOpen, Circle, CheckCircle, Clock, Rocket, AlertCircle } from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';

const ProjectList: React.FC = () => {
  const { projects, currentProject, setCurrentProject } = useProject();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planning':
        return <Circle className="w-4 h-4 text-gray-400" />;
      case 'developing':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'testing':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'deploying':
        return <Rocket className="w-4 h-4 text-purple-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'text-gray-500 bg-gray-100 dark:bg-gray-700';
      case 'developing':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/40';
      case 'testing':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/40';
      case 'deploying':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/40';
      case 'completed':
        return 'text-green-600 bg-green-100 dark:bg-green-900/40';
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-700';
    }
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
        Projetos ({projects.length})
      </h3>
      
      <div className="space-y-2">
        {projects.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Nenhum projeto ainda</p>
            <p className="text-xs">Crie seu primeiro projeto!</p>
          </div>
        ) : (
          projects.map((project, index) => (
            <motion.button
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setCurrentProject(project)}
              className={`w-full p-3 rounded-lg text-left transition-all hover:scale-105 ${
                currentProject?.id === project.id
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700'
                  : 'bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white truncate">
                  {project.name}
                </h4>
                {getStatusIcon(project.status)}
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
                {project.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {project.language}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
            </motion.button>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectList;