import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Palette, Zap, Code, Sparkles } from 'lucide-react';

interface Persona {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  style: string;
}

const PersonaSelector: React.FC = () => {
  const [selectedPersona, setSelectedPersona] = useState<string>('default');

  const personas: Persona[] = [
    {
      id: 'default',
      name: 'Padrão',
      description: 'Estilo moderno e limpo',
      icon: <User className="w-4 h-4" />,
      color: 'blue',
      style: 'Modern & Clean'
    },
    {
      id: 'creative',
      name: 'Criativo',
      description: 'Design ousado e inovador',
      icon: <Palette className="w-4 h-4" />,
      color: 'purple',
      style: 'Bold & Creative'
    },
    {
      id: 'minimal',
      name: 'Minimalista',
      description: 'Simplicidade e elegância',
      icon: <Sparkles className="w-4 h-4" />,
      color: 'gray',
      style: 'Simple & Elegant'
    },
    {
      id: 'tech',
      name: 'Tech',
      description: 'Futurista e tecnológico',
      icon: <Zap className="w-4 h-4" />,
      color: 'green',
      style: 'Futuristic & Tech'
    }
  ];

  const getPersonaColors = (color: string, selected: boolean) => {
    const colorMap = {
      blue: selected 
        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400'
        : 'bg-gray-50 dark:bg-gray-700 border-transparent text-gray-600 dark:text-gray-400',
      purple: selected 
        ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700 text-purple-600 dark:text-purple-400'
        : 'bg-gray-50 dark:bg-gray-700 border-transparent text-gray-600 dark:text-gray-400',
      gray: selected 
        ? 'bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-300'
        : 'bg-gray-50 dark:bg-gray-700 border-transparent text-gray-600 dark:text-gray-400',
      green: selected 
        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-600 dark:text-green-400'
        : 'bg-gray-50 dark:bg-gray-700 border-transparent text-gray-600 dark:text-gray-400'
    };
    return colorMap[color as keyof typeof colorMap];
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
        Persona de Design
      </h3>
      
      <div className="space-y-2">
        {personas.map((persona, index) => (
          <motion.button
            key={persona.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedPersona(persona.id)}
            className={`w-full p-3 rounded-lg text-left transition-all hover:scale-105 border-2 ${
              getPersonaColors(persona.color, selectedPersona === persona.id)
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {persona.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">
                  {persona.name}
                </h4>
                <p className="text-xs opacity-75 truncate">
                  {persona.description}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-lg border border-blue-100 dark:border-blue-800">
        <div className="flex items-center space-x-2 mb-2">
          <Code className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
            Treinar Persona
          </span>
        </div>
        <p className="text-xs text-blue-700 dark:text-blue-300">
          Carregue seus próprios exemplos para treinar uma persona personalizada
        </p>
        <button className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline">
          Começar Treinamento →
        </button>
      </div>
    </div>
  );
};

export default PersonaSelector;