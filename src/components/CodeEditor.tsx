import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Copy, Download, Maximize2 } from 'lucide-react';
import { ProjectFile } from '../contexts/ProjectContext';

interface CodeEditorProps {
  file: ProjectFile;
  onSave: (content: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ file, onSave }) => {
  const [content, setContent] = useState(file.content);
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    setContent(file.content);
    setIsModified(false);
  }, [file]);

  const handleContentChange = (value: string) => {
    setContent(value);
    setIsModified(value !== file.content);
  };

  const handleSave = () => {
    onSave(content);
    setIsModified(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-4">
          <h3 className="font-medium text-gray-900 dark:text-white">
            {file.name}
            {isModified && <span className="text-orange-500 ml-2">•</span>}
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
            {file.language}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Copiar código"
          >
            <Copy className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleSave}
            disabled={!isModified}
            className={`p-2 rounded-lg transition-colors ${
              isModified
                ? 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
            }`}
            title="Salvar (Ctrl+S)"
          >
            <Save className="w-4 h-4" />
          </button>
          
          <button
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Tela cheia"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 relative">
        <textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-full p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-none outline-none resize-none"
          placeholder="Comece a escrever seu código..."
          spellCheck={false}
        />
        
        {/* Line numbers (simple implementation) */}
        <div className="absolute left-0 top-0 p-4 text-xs text-gray-400 dark:text-gray-600 pointer-events-none font-mono select-none">
          {content.split('\n').map((_, index) => (
            <div key={index} className="h-5 leading-5">
              {index + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 text-xs bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <span className="text-gray-600 dark:text-gray-400">
            Linhas: {content.split('\n').length}
          </span>
          <span className="text-gray-600 dark:text-gray-400">
            Caracteres: {content.length}
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          {isModified && (
            <span className="text-orange-600 dark:text-orange-400">
              Não salvo
            </span>
          )}
          <span className="text-gray-600 dark:text-gray-400">
            {file.language.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;