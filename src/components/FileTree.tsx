import React from 'react';
import { motion } from 'framer-motion';
import { File, FileText, Code, Image, Settings } from 'lucide-react';
import { ProjectFile } from '../contexts/ProjectContext';

interface FileTreeProps {
  files: ProjectFile[];
  selectedFile: string | null;
  onFileSelect: (fileId: string) => void;
}

const FileTree: React.FC<FileTreeProps> = ({ files, selectedFile, onFileSelect }) => {
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'tsx':
      case 'jsx':
      case 'ts':
      case 'js':
        return <Code className="w-4 h-4 text-blue-500" />;
      case 'css':
      case 'scss':
        return <FileText className="w-4 h-4 text-pink-500" />;
      case 'html':
        return <FileText className="w-4 h-4 text-orange-500" />;
      case 'json':
        return <Settings className="w-4 h-4 text-yellow-500" />;
      case 'png':
      case 'jpg':
      case 'svg':
        return <Image className="w-4 h-4 text-green-500" />;
      default:
        return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-4">
      {files.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          <File className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Nenhum arquivo ainda</p>
        </div>
      ) : (
        <div className="space-y-1">
          {files.map((file, index) => (
            <motion.button
              key={file.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onFileSelect(file.id)}
              className={`w-full flex items-center space-x-3 p-2 rounded-lg text-left transition-all hover:bg-gray-100 dark:hover:bg-gray-700 ${
                selectedFile === file.id
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {getFileIcon(file.name)}
              <span className="text-sm truncate">{file.name}</span>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileTree;