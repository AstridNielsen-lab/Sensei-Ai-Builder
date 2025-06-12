import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon, Play, Square, Trash2, Download, Copy, Zap, Bot, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

interface TerminalLog {
  id: string;
  type: 'command' | 'output' | 'error' | 'info' | 'success' | 'ai';
  content: string;
  timestamp: Date;
}

interface TerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Terminal: React.FC<TerminalProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const [currentDirectory, setCurrentDirectory] = useState('C:\\Projects');
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
  const API_KEY = "AIzaSyAV6k7MxnZWDe_APYW2XO8PV2QfjrcTtqE";

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const addLog = (type: TerminalLog['type'], content: string) => {
    const newLog: TerminalLog = {
      id: Date.now().toString() + Math.random(),
      type,
      content,
      timestamp: new Date()
    };
    setLogs(prev => [...prev, newLog]);
  };

  const simulateCommand = async (command: string): Promise<string> => {
    // Simular comandos PowerShell comuns
    const cmd = command.toLowerCase().trim();
    
    if (cmd.startsWith('cd ')) {
      const newDir = command.substring(3).trim();
      setCurrentDirectory(newDir);
      return `Directory changed to: ${newDir}`;
    }
    
    if (cmd === 'dir' || cmd === 'ls') {
      return `Directory of ${currentDirectory}

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----        ${new Date().toLocaleDateString()}                src
d-----        ${new Date().toLocaleDateString()}                public
d-----        ${new Date().toLocaleDateString()}                node_modules
-a----        ${new Date().toLocaleDateString()}           1024 package.json
-a----        ${new Date().toLocaleDateString()}           2048 README.md
-a----        ${new Date().toLocaleDateString()}            512 .gitignore`;
    }
    
    if (cmd.startsWith('mkdir ')) {
      const dirName = command.substring(6).trim();
      return `Directory created: ${dirName}`;
    }
    
    if (cmd.startsWith('git ')) {
      if (cmd === 'git init') {
        return 'Initialized empty Git repository in ' + currentDirectory;
      }
      if (cmd === 'git status') {
        return `On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

        modified:   src/App.tsx
        modified:   src/components/Terminal.tsx

no changes added to commit (use "git add ." or "git commit -a")`;
      }
      if (cmd.startsWith('git add')) {
        return 'Files staged for commit';
      }
      if (cmd.startsWith('git commit')) {
        return '[main 1a2b3c4] Automated commit via AI\n 2 files changed, 45 insertions(+), 12 deletions(-)';
      }
    }
    
    if (cmd.startsWith('npm ') || cmd.startsWith('yarn ')) {
      if (cmd.includes('install') || cmd.includes('add')) {
        return `Installing packages...
✓ Package installed successfully
✓ Dependencies updated
✓ Ready to use`;
      }
      if (cmd.includes('run dev') || cmd.includes('start')) {
        return `Starting development server...
✓ Server running on http://localhost:3000
✓ Ready for development`;
      }
      if (cmd.includes('build')) {
        return `Building for production...
✓ Build completed successfully
✓ Output directory: dist/`;
      }
    }
    
    if (cmd.startsWith('vercel')) {
      if (cmd === 'vercel' || cmd === 'vercel deploy') {
        return `🔍 Inspect: https://vercel.com/username/project-abc123
✅ Production: https://project-abc123.vercel.app [copied to clipboard]`;
      }
    }
    
    // Comando genérico
    return `Command executed: ${command}
✓ Operation completed successfully`;
  };

  const executeCommand = async (command: string) => {
    if (!command.trim()) return;
    
    addLog('command', `PS ${currentDirectory}> ${command}`);
    setIsExecuting(true);
    
    try {
      // Simular delay de execução
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      
      const output = await simulateCommand(command);
      addLog('output', output);
      
      // Se for um comando de sucesso, adicionar log de sucesso
      if (output.includes('✓') || output.includes('successfully')) {
        addLog('success', '✅ Command executed successfully');
      }
      
    } catch (error) {
      addLog('error', `❌ Error executing command: ${error}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const executeAICommand = async (prompt: string) => {
    addLog('ai', `🤖 AI Processing: ${prompt}`);
    setIsExecuting(true);
    
    try {
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Você é um assistente especializado em PowerShell e desenvolvimento web. 
                  Baseado no prompt: "${prompt}"
                  
                  Gere uma sequência de comandos PowerShell para:
                  1. Criar estrutura de projeto
                  2. Instalar dependências necessárias
                  3. Configurar arquivos
                  4. Executar testes
                  5. Fazer deploy
                  
                  Retorne apenas os comandos, um por linha, sem explicações adicionais.
                  Use comandos reais de PowerShell, npm, git e vercel.
                  
                  Exemplo de formato:
                  mkdir meu-projeto
                  cd meu-projeto
                  npm init -y
                  npm install react
                  git init
                  git add .
                  git commit -m "Initial commit"
                  vercel deploy`
                }
              ]
            }
          ]
        })
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates.length > 0) {
        const aiResponse = data.candidates[0].content.parts[0].text;
        const commands = aiResponse.split('\n').filter((cmd: string) => cmd.trim());
        
        addLog('ai', `🎯 AI Generated ${commands.length} commands`);
        
        // Executar comandos sequencialmente
        for (let i = 0; i < commands.length; i++) {
          const command = commands[i].trim();
          if (command) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Delay entre comandos
            await executeCommand(command);
          }
        }
        
        addLog('success', '🚀 AI automation completed successfully!');
        
      } else {
        throw new Error('Invalid AI response');
      }
    } catch (error) {
      addLog('error', `❌ AI Error: ${error}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isExecuting) {
      const command = currentCommand.trim();
      if (command) {
        if (command.startsWith('ai:')) {
          // Comando AI
          const aiPrompt = command.substring(3).trim();
          executeAICommand(aiPrompt);
        } else {
          // Comando normal
          executeCommand(command);
        }
        setCurrentCommand('');
      }
    }
  };

  const clearTerminal = () => {
    setLogs([]);
  };

  const copyLogs = () => {
    const logText = logs.map(log => 
      `[${log.timestamp.toLocaleTimeString()}] ${log.type.toUpperCase()}: ${log.content}`
    ).join('\n');
    navigator.clipboard.writeText(logText);
    toast.success('Logs copiados para clipboard!');
  };

  const downloadLogs = () => {
    const logText = logs.map(log => 
      `[${log.timestamp.toLocaleTimeString()}] ${log.type.toUpperCase()}: ${log.content}`
    ).join('\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `terminal-logs-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getLogColor = (type: TerminalLog['type']) => {
    switch (type) {
      case 'command':
        return 'text-blue-400';
      case 'output':
        return 'text-gray-300';
      case 'error':
        return 'text-red-400';
      case 'success':
        return 'text-green-400';
      case 'info':
        return 'text-yellow-400';
      case 'ai':
        return 'text-purple-400';
      default:
        return 'text-gray-300';
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-6xl h-5/6 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <TerminalIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">PowerShell Terminal</h3>
              <p className="text-gray-400 text-sm">AI-Powered Development Environment</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setAutoMode(!autoMode)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                autoMode 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Bot className="w-4 h-4 inline mr-1" />
              AI Mode
            </button>
            
            <button
              onClick={copyLogs}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              title="Copiar logs"
            >
              <Copy className="w-4 h-4" />
            </button>
            
            <button
              onClick={downloadLogs}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              title="Download logs"
            >
              <Download className="w-4 h-4" />
            </button>
            
            <button
              onClick={clearTerminal}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              title="Limpar terminal"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Square className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Content */}
        <div className="flex-1 flex flex-col">
          {/* Logs */}
          <div 
            ref={terminalRef}
            className="flex-1 p-4 overflow-y-auto bg-black font-mono text-sm"
          >
            <AnimatePresence>
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-1 ${getLogColor(log.type)}`}
                >
                  <span className="text-gray-500 text-xs mr-2">
                    [{log.timestamp.toLocaleTimeString()}]
                  </span>
                  <span className="whitespace-pre-wrap">{log.content}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isExecuting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-2 text-yellow-400"
              >
                <Loader className="w-4 h-4 animate-spin" />
                <span>Executing...</span>
              </motion.div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-gray-700 p-4 bg-gray-800">
            <div className="flex items-center space-x-2">
              <span className="text-blue-400 font-mono text-sm">
                PS {currentDirectory}{'>'} 
              </span>
              <input
                ref={inputRef}
                type="text"
                value={currentCommand}
                onChange={(e) => setCurrentCommand(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isExecuting}
                className="flex-1 bg-transparent text-white font-mono text-sm outline-none"
                placeholder={autoMode ? "Digite 'ai: criar um site React' para automação completa..." : "Digite um comando PowerShell..."}
              />
              {isExecuting && (
                <Loader className="w-4 h-4 animate-spin text-yellow-400" />
              )}
            </div>
            
            <div className="mt-2 text-xs text-gray-500">
              💡 Dicas: Use 'ai: [sua solicitação]' para automação completa | Ctrl+C para cancelar | 'clear' para limpar
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="border-t border-gray-700 p-4 bg-gray-800">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => executeAICommand('criar um site React moderno com TypeScript')}
              disabled={isExecuting}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors disabled:opacity-50"
            >
              🚀 React + TS
            </button>
            <button
              onClick={() => executeAICommand('criar uma API Node.js com Express')}
              disabled={isExecuting}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors disabled:opacity-50"
            >
              🔧 Node API
            </button>
            <button
              onClick={() => executeAICommand('configurar projeto Next.js com Tailwind')}
              disabled={isExecuting}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg transition-colors disabled:opacity-50"
            >
              ⚡ Next.js
            </button>
            <button
              onClick={() => executeCommand('git status')}
              disabled={isExecuting}
              className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white text-xs rounded-lg transition-colors disabled:opacity-50"
            >
              📊 Git Status
            </button>
            <button
              onClick={() => executeCommand('vercel deploy')}
              disabled={isExecuting}
              className="px-3 py-1 bg-pink-600 hover:bg-pink-700 text-white text-xs rounded-lg transition-colors disabled:opacity-50"
            >
              🌐 Deploy
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Terminal;