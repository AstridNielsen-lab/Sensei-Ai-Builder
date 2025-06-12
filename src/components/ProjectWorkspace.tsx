import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useProject } from '../contexts/ProjectContext';
import CodeEditor from './CodeEditor';
import FileTree from './FileTree';
import Terminal from './Terminal';
import { File, Folder, Plus, Save, Play, Globe, Terminal as TerminalIcon } from 'lucide-react';

const ProjectWorkspace: React.FC = () => {
  const { currentProject, updateProject } = useProject();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'files' | 'preview'>('files');
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  if (!currentProject) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Selecione um projeto para começar
      </div>
    );
  }

  const selectedFileData = currentProject.files.find(f => f.id === selectedFile);

  const handleFileSelect = (fileId: string) => {
    setSelectedFile(fileId);
  };

  const handleFileSave = (fileId: string, content: string) => {
    const updatedFiles = currentProject.files.map(file =>
      file.id === fileId ? { ...file, content } : file
    );
    
    updateProject(currentProject.id, { files: updatedFiles });
  };

  const createNewFile = () => {
    const name = prompt('Nome do arquivo:');
    if (!name) return;
    
    const newFile = {
      id: Date.now().toString(),
      name,
      path: `/${name}`,
      content: '',
      language: name.endsWith('.tsx') ? 'typescript' : 
               name.endsWith('.js') ? 'javascript' :
               name.endsWith('.css') ? 'css' :
               name.endsWith('.html') ? 'html' : 'text'
    };
    
    updateProject(currentProject.id, {
      files: [...currentProject.files, newFile]
    });
    
    setSelectedFile(newFile.id);
  };

  return (
    <div className="h-full flex">
      {/* File Explorer */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Arquivos
            </h3>
            <button
              onClick={createNewFile}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button className="flex items-center justify-center space-x-2 p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
              <Save className="w-4 h-4" />
              <span className="text-sm">Salvar</span>
            </button>
            <button className="flex items-center justify-center space-x-2 p-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
              <Play className="w-4 h-4" />
              <span className="text-sm">Executar</span>
            </button>
          </div>

          {/* Terminal Button */}
          <button
            onClick={() => setIsTerminalOpen(true)}
            className="w-full flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
          >
            <TerminalIcon className="w-5 h-5" />
            <span className="font-medium">Abrir Terminal AI</span>
          </button>
        </div>
        
        <FileTree 
          files={currentProject.files}
          selectedFile={selectedFile}
          onFileSelect={handleFileSelect}
        />
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex">
            <button
              onClick={() => setActiveTab('files')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'files'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <File className="w-4 h-4 inline mr-2" />
              Editor
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'preview'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Globe className="w-4 h-4 inline mr-2" />
              Preview
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'files' && (
            selectedFileData ? (
              <CodeEditor
                file={selectedFileData}
                onSave={(content) => handleFileSave(selectedFileData.id, content)}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <File className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Selecione um arquivo para editar</p>
                  <p className="text-sm mt-2">ou crie um novo arquivo</p>
                  <button
                    onClick={() => setIsTerminalOpen(true)}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <TerminalIcon className="w-4 h-4 inline mr-2" />
                    Abrir Terminal AI
                  </button>
                </div>
              </div>
            )
          )}
          
          {activeTab === 'preview' && (
            <div className="h-full bg-white dark:bg-gray-900 flex items-center justify-center">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Preview será exibido aqui</p>
                <p className="text-sm mt-2">Execute o projeto para ver o resultado</p>
                <button
                  onClick={() => setIsTerminalOpen(true)}
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <TerminalIcon className="w-4 h-4 inline mr-2" />
                  Executar no Terminal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Terminal Modal */}
      <Terminal 
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
      />
    </div>
  );
};

export default ProjectWorkspace;