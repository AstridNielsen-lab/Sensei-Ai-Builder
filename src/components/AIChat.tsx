import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Code, Terminal, Loader, Zap, Copy } from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  isCode?: boolean;
  language?: string;
}

const AIChat: React.FC = () => {
  const { currentProject, updateProject } = useProject();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
  const API_KEY = "AIzaSyAV6k7MxnZWDe_APYW2XO8PV2QfjrcTtqE";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Welcome message
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          type: 'system',
          content: `🤖 Olá! Eu sou seu assistente de desenvolvimento AI. ${
            currentProject 
              ? `Estou aqui para ajudar com seu projeto "${currentProject.name}".`
              : 'Crie um projeto para começarmos a desenvolver juntos!'
          }

Posso ajudar você a:
• Gerar código em qualquer linguagem
• Criar estruturas de projeto completas
• Implementar funcionalidades específicas
• Otimizar e debugar código
• Fazer deploy automático
• Executar comandos no terminal

O que gostaria de criar hoje?`,
          timestamp: new Date()
        }
      ]);
    }
  }, [currentProject, messages.length]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

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
                  text: `Você é um assistente de desenvolvimento especializado que ajuda a criar sites e aplicativos. 
                  Contexto do projeto atual: ${currentProject ? `
                  Nome: ${currentProject.name}
                  Descrição: ${currentProject.description}
                  Linguagem: ${currentProject.language}
                  Framework: ${currentProject.framework}
                  Status: ${currentProject.status}
                  Arquivos existentes: ${currentProject.files.map(f => f.name).join(', ')}
                  ` : 'Nenhum projeto selecionado'}
                  
                  Pergunta do usuário: ${input}
                  
                  Instruções:
                  - Seja prático e direto
                  - Forneça código funcional quando solicitado
                  - Use as melhores práticas de desenvolvimento
                  - Considere o contexto do projeto atual
                  - Se for código, marque claramente com \`\`\`linguagem
                  - Explique brevemente o que o código faz
                  - Sugira próximos passos quando apropriado`
                }
              ]
            }
          ]
        })
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates.length > 0) {
        const aiResponse = data.candidates[0].content.parts[0].text;
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: aiResponse,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiMessage]);

        // Auto-execute if it's a command or file creation
        if (aiResponse.includes('```') && currentProject) {
          const codeBlocks = aiResponse.match(/```(\w+)?\n([\s\S]*?)```/g);
          if (codeBlocks) {
            codeBlocks.forEach((block, index) => {
              const match = block.match(/```(\w+)?\n([\s\S]*?)```/);
              if (match) {
                const language = match[1] || 'text';
                const code = match[2];
                
                // Auto-create file if it looks like a complete file
                if (code.length > 50 && (language === 'typescript' || language === 'javascript' || language === 'html' || language === 'css')) {
                  const fileName = `generated-${Date.now()}-${index}.${language === 'typescript' ? 'tsx' : language === 'javascript' ? 'js' : language}`;
                  
                  const newFile = {
                    id: Date.now().toString() + index,
                    name: fileName,
                    path: `/${fileName}`,
                    content: code,
                    language
                  };
                  
                  updateProject(currentProject.id, {
                    files: [...currentProject.files, newFile]
                  });
                  
                  toast.success(`Arquivo ${fileName} criado automaticamente!`);
                }
              }
            });
          }
        }
      } else {
        throw new Error('Resposta inválida da API');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: '❌ Erro ao processar sua solicitação. Tente novamente.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Erro ao comunicar com a IA');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyCode = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Código copiado!');
  };

  const renderMessage = (message: Message) => {
    const isCodeBlock = message.content.includes('```');
    
    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex space-x-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
      >
        {message.type !== 'user' && (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            message.type === 'ai' ? 'bg-blue-500' : 'bg-gray-500'
          }`}>
            {message.type === 'ai' ? (
              <Bot className="w-5 h-5 text-white" />
            ) : (
              <Terminal className="w-5 h-5 text-white" />
            )}
          </div>
        )}
        
        <div className={`max-w-3xl ${message.type === 'user' ? 'order-first' : ''}`}>
          <div className={`rounded-lg p-4 ${
            message.type === 'user'
              ? 'bg-blue-500 text-white ml-auto'
              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
          }`}>
            {isCodeBlock ? (
              <div className="space-y-4">
                {message.content.split('```').map((part, index) => {
                  if (index % 2 === 0) {
                    // Regular text
                    return part.trim() ? (
                      <div key={index} className="whitespace-pre-wrap text-gray-900 dark:text-gray-100">
                        {part.trim()}
                      </div>
                    ) : null;
                  } else {
                    // Code block
                    const lines = part.split('\n');
                    const language = lines[0] || 'text';
                    const code = lines.slice(1).join('\n');
                    
                    return (
                      <div key={index} className="relative">
                        <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 px-4 py-2 text-sm">
                          <span className="text-gray-600 dark:text-gray-400">{language}</span>
                          <button
                            onClick={() => copyCode(code)}
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        <pre className="bg-gray-900 text-green-400 p-4 overflow-x-auto text-sm">
                          <code>{code}</code>
                        </pre>
                      </div>
                    );
                  }
                })}
              </div>
            ) : (
              <div className="whitespace-pre-wrap">
                {message.content}
              </div>
            )}
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
        
        {message.type === 'user' && (
          <div className="w-8 h-8 bg-gray-600 dark:bg-gray-400 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">
              AI Assistant
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {currentProject ? `Trabalhando em: ${currentProject.name}` : 'Assistente de desenvolvimento'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <AnimatePresence>
          {messages.map(renderMessage)}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex space-x-3"
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Loader className="w-4 h-4 animate-spin text-blue-500" />
                <span className="text-gray-600 dark:text-gray-400">
                  Processando sua solicitação...
                </span>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="flex space-x-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={currentProject 
              ? "Descreva o que você quer implementar, gerar código, ou pergunte sobre desenvolvimento..." 
              : "Crie um projeto primeiro ou faça uma pergunta sobre desenvolvimento..."
            }
            className="flex-1 resize-none border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            disabled={isLoading}
          />
          
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              input.trim() && !isLoading
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Pressione Enter para enviar, Shift+Enter para nova linha
        </div>
      </div>
    </div>
  );
};

export default AIChat;