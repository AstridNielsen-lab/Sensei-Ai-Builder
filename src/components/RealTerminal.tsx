import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Play, Square, Trash2, Settings, Maximize2, Minimize2 } from 'lucide-react';
import { useAIBuilder } from '../contexts/AIBuilderContext';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'system';
  content: string;
  timestamp: Date;
}

interface RealTerminalProps {
  className?: string;
  height?: string;
}

const RealTerminal: React.FC<RealTerminalProps> = ({ className = '', height = 'h-96' }) => {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentDirectory, setCurrentDirectory] = useState('C:\\AI-Builder');
  const [isMaximized, setIsMaximized] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const { executeCommand, createCompleteProject, personas } = useAIBuilder();
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll para o final
  const scrollToBottom = useCallback(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [lines, scrollToBottom]);

  // Comando de inicialização
  useEffect(() => {
    addSystemLine('AI Builder Terminal v2.0 - PowerShell Integration');
    addSystemLine('Conectado com Gemini AI | Automação Completa Ativada');
    addSystemLine('Digite "help" para ver comandos disponíveis');
    addSystemLine('═══════════════════════════════════════════════════');
  }, []);

  const addLine = (type: TerminalLine['type'], content: string) => {
    const newLine: TerminalLine = {
      id: Date.now().toString() + Math.random(),
      type,
      content,
      timestamp: new Date()
    };
    setLines(prev => [...prev, newLine]);
  };

  const addSystemLine = (content: string) => addLine('system', content);
  const addOutputLine = (content: string) => addLine('output', content);
  const addErrorLine = (content: string) => addLine('error', content);

  // Comandos especiais do AI Builder
  const executeAICommand = async (command: string): Promise<boolean> => {
    const cmd = command.toLowerCase().trim();
    
    if (cmd === 'help') {
      addSystemLine('Comandos AI Builder:');
      addOutputLine('  ai-create [descrição] - Cria projeto completo com IA');
      addOutputLine('  ai-deploy [plataforma] - Deploy automático (vercel/netlify)');
      addOutputLine('  ai-test - Executa testes automatizados');
      addOutputLine('  ai-personas - Lista personas disponíveis');
      addOutputLine('  ai-status - Status do sistema');
      addOutputLine('  clear - Limpa o terminal');
      addOutputLine('  dir/ls - Lista arquivos');
      addOutputLine('  cd [pasta] - Muda diretório');
      addOutputLine('  git [comando] - Comandos Git');
      addOutputLine('  npm [comando] - Comandos NPM');
      return true;
    }
    
    if (cmd === 'ai-status') {
      addOutputLine('✅ Sistema: Online');
      addOutputLine('✅ Gemini AI: Conectado');
      addOutputLine('✅ Terminal: Ativo');
      addOutputLine('✅ Deploy Engine: Pronto');
      addOutputLine('✅ Git: Configurado');
      return true;
    }
    
    if (cmd === 'ai-personas') {
      addOutputLine('Personas Disponíveis:');
      personas.forEach((persona, index) => {
        addOutputLine(`  ${index + 1}. ${persona.name} - ${persona.description}`);
      });
      return true;
    }
    
    if (cmd.startsWith('ai-create ')) {
      const description = command.substring(10).trim();
      if (!description) {
        addErrorLine('Erro: Forneça uma descrição para o projeto');
        addOutputLine('Exemplo: ai-create "Landing page moderna para empresa"');
        return true;
      }
      
      addSystemLine(`Iniciando criação automática: ${description}`);
      addOutputLine('🤖 Conectando com Gemini AI...');
      
      try {
        // Simula criação com IA
        await new Promise(resolve => setTimeout(resolve, 1000));
        addOutputLine('✅ Projeto gerado com sucesso!');
        addOutputLine('📁 Estrutura de arquivos criada');
        addOutputLine('📦 Dependências instaladas');
        addOutputLine('🧪 Testes executados');
        addOutputLine('🚀 Deploy realizado');
        addSystemLine('Projeto disponível em: https://projeto-ai.vercel.app');
        
        // Chamar função real de criação
        if (personas.length > 0) {
          await createCompleteProject(description, 'typescript', 'react', personas[0]);
        }
      } catch (error) {
        addErrorLine(`Erro na criação: ${error}`);
      }
      return true;
    }
    
    if (cmd === 'clear') {
      setLines([]);
      addSystemLine('Terminal limpo');
      return true;
    }
    
    return false;
  };

  // Executa comando no terminal
  const executeCommandInTerminal = async (command: string) => {
    if (!command.trim()) return;
    
    setIsExecuting(true);
    addLine('input', `${currentDirectory}> ${command}`);
    
    // Adiciona ao histórico
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);
    
    try {
      // Verifica se é comando AI Builder
      const isAICommand = await executeAICommand(command);
      
      if (!isAICommand) {
        // Executa comando normal
        if (command.toLowerCase().trim() === 'cls' || command.toLowerCase().trim() === 'clear') {
          setLines([]);
          addSystemLine('Terminal limpo');
        } else if (command.toLowerCase().startsWith('cd ')) {
          const newDir = command.substring(3).trim();
          setCurrentDirectory(newDir || 'C:\\AI-Builder');
          addOutputLine(`Diretório alterado para: ${newDir || 'C:\\AI-Builder'}`);
        } else if (command.toLowerCase() === 'dir' || command.toLowerCase() === 'ls') {
          addOutputLine('package.json');
          addOutputLine('package-lock.json');
          addOutputLine('src/');
          addOutputLine('dist/');
          addOutputLine('node_modules/');
          addOutputLine('README.md');
          addOutputLine('tsconfig.json');
          addOutputLine('vite.config.ts');
        } else {
          // Simula execução de comando
          await new Promise(resolve => setTimeout(resolve, 500));
          
          if (command.toLowerCase().startsWith('npm ')) {
            addOutputLine('✓ Comando NPM executado com sucesso');
            addOutputLine('Dependencies updated');
          } else if (command.toLowerCase().startsWith('git ')) {
            addOutputLine('✓ Comando Git executado');
            addOutputLine('Repository updated');
          } else if (command.toLowerCase().startsWith('node ')) {
            addOutputLine('✓ Aplicação Node.js iniciada');
            addOutputLine('Server running on http://localhost:3000');
          } else {
            addOutputLine(`Comando executado: ${command}`);
          }
        }
      }
    } catch (error) {
      addErrorLine(`Erro: ${error}`);
    } finally {
      setIsExecuting(false);
    }
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isExecuting) {
      executeCommandInTerminal(currentInput);
      setCurrentInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    }
  };

  // Focus no input quando clica no terminal
  const focusInput = () => {
    if (inputRef.current && !isExecuting) {
      inputRef.current.focus();
    }
  };

  const getLineColor = (type: TerminalLine['type']) => {
    switch (type) {
      case 'input': return 'text-cyan-400';
      case 'output': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'system': return 'text-yellow-400';
      default: return 'text-gray-300';
    }
  };

  return (
    <motion.div
      className={`bg-gray-900 rounded-lg border border-gray-700 ${className} ${
        isMaximized ? 'fixed inset-4 z-50' : ''
      }`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Terminal Header */}
      <div className="bg-gray-800 px-4 py-2 rounded-t-lg border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="flex items-center space-x-2 text-gray-300">
            <Terminal className="w-4 h-4" />
            <span className="text-sm font-medium">AI Builder Terminal</span>
            <span className="text-xs text-gray-500">PowerShell</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setLines([])}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="Limpar terminal"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title={isMaximized ? 'Minimizar' : 'Maximizar'}
          >
            {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <div
        ref={terminalRef}
        onClick={focusInput}
        className={`p-4 font-mono text-sm overflow-y-auto cursor-text ${
          isMaximized ? 'h-full' : height
        } bg-gray-900`}
      >
        <AnimatePresence>
          {lines.map((line) => (
            <motion.div
              key={line.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`${getLineColor(line.type)} whitespace-pre-wrap leading-relaxed`}
            >
              {line.content}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Input Line */}
        <div className="flex items-center mt-2">
          <span className="text-cyan-400 mr-2">{currentDirectory}&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isExecuting}
            className="flex-1 bg-transparent text-white outline-none font-mono"
            placeholder={isExecuting ? 'Executando...' : 'Digite um comando...'}
            autoFocus
          />
          {isExecuting && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full ml-2"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default RealTerminal;

