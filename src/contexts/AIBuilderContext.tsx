import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Project, 
  ProjectFile, 
  Persona, 
  AIRequest, 
  AIResponse,
  TerminalCommand,
  ProjectProgress,
  DeploymentConfig,
  VercelDeployment,
  TestResult
} from '../types';
import { aiService } from '../services/aiService';
import { terminalService } from '../services/terminalService';
import { deployService } from '../services/deployService';
import { DEFAULT_PERSONAS } from '../config/api';

interface AIBuilderContextType {
  // Projetos
  projects: Project[];
  currentProject: Project | null;
  isGenerating: boolean;
  progress: ProjectProgress | null;
  
  // Personas
  personas: Persona[];
  
  // Ações de Projeto
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'files'>) => void;
  selectProject: (id: string) => void;
  deleteProject: (id: string) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  
  // IA e Automação
  generateProjectWithAI: (request: AIRequest) => Promise<void>;
  improveProject: (feedback: string) => Promise<void>;
  testProject: () => Promise<TestResult[]>;
  createCompleteProject: (prompt: string, language: string, framework: string, persona: Persona) => Promise<void>;
  
  // Personas
  createPersona: (description: string, stylePreferences: string, examples?: string) => Promise<void>;
  updatePersona: (id: string, updates: Partial<Persona>) => void;
  deletePersona: (id: string) => void;
  
  // Terminal
  executeCommand: (command: string) => Promise<TerminalCommand>;
  getTerminalHistory: () => TerminalCommand[];
  clearTerminal: () => void;
  
  // Deploy
  deployProject: (config: DeploymentConfig) => Promise<VercelDeployment>;
  getDeployments: () => VercelDeployment[];
  
  // Arquivos
  updateFile: (path: string, content: string) => void;
  addFile: (file: ProjectFile) => void;
  deleteFile: (path: string) => void;
}

const AIBuilderContext = createContext<AIBuilderContextType | undefined>(undefined);

export const useAIBuilder = () => {
  const context = useContext(AIBuilderContext);
  if (!context) {
    throw new Error('useAIBuilder must be used within an AIBuilderProvider');
  }
  return context;
};

interface AIBuilderProviderProps {
  children: ReactNode;
}

export const AIBuilderProvider: React.FC<AIBuilderProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [personas, setPersonas] = useState<Persona[]>(DEFAULT_PERSONAS);
  const [progress, setProgress] = useState<ProjectProgress | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Carrega dados do localStorage
  useEffect(() => {
    try {
      // Verifica se localStorage está disponível (evita erros no SSR)
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedProjects = localStorage.getItem('ai-builder-projects');
        if (savedProjects) {
          try {
            const parsed = JSON.parse(savedProjects);
            if (Array.isArray(parsed)) {
              setProjects(parsed.map((p: any) => ({ 
                ...p, 
                createdAt: new Date(p.createdAt),
                updatedAt: new Date(p.updatedAt)
              })));
            }
          } catch (error) {
            console.error('Erro ao carregar projetos:', error);
            // Limpa dados corrompidos
            localStorage.removeItem('ai-builder-projects');
          }
        }

        const savedPersonas = localStorage.getItem('ai-builder-personas');
        if (savedPersonas) {
          try {
            const parsed = JSON.parse(savedPersonas);
            if (Array.isArray(parsed)) {
              setPersonas(prev => [...prev, ...parsed]);
            }
          } catch (error) {
            console.error('Erro ao carregar personas:', error);
            // Limpa dados corrompidos
            localStorage.removeItem('ai-builder-personas');
          }
        }
      }
    } catch (error) {
      console.error('Erro geral ao carregar dados:', error);
    }
  }, []);

  // Salva projetos no localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('ai-builder-projects', JSON.stringify(projects));
      }
    } catch (error) {
      console.error('Erro ao salvar projetos:', error);
    }
  }, [projects]);

  // Salva personas customizadas no localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const customPersonas = personas.filter(p => p.trainedBy === 'user');
        localStorage.setItem('ai-builder-personas', JSON.stringify(customPersonas));
      }
    } catch (error) {
      console.error('Erro ao salvar personas:', error);
    }
  }, [personas]);

  const createProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'files'>) => {
    const newProject: Project = {
      ...projectData,
      id: `project-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'creating',
      files: []
    };
    setProjects(prev => [...prev, newProject]);
    setCurrentProject(newProject);
    console.log('🎉 Novo projeto criado:', newProject.name);
  };

  const selectProject = (id: string) => {
    const project = projects.find(p => p.id === id);
    setCurrentProject(project || null);
    console.log('📝 Projeto selecionado:', project?.name || 'Nenhum');
  };

  const deleteProject = (id: string) => {
    const project = projects.find(p => p.id === id);
    setProjects(prev => prev.filter(p => p.id !== id));
    if (currentProject?.id === id) {
      setCurrentProject(null);
    }
    terminalService.deleteProject(id);
    console.log('🗑️ Projeto deletado:', project?.name);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => 
      p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
    ));
    if (currentProject?.id === id) {
      setCurrentProject(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);
    }
  };

  const generateProjectWithAI = async (request: AIRequest) => {
    if (!currentProject) {
      console.error('Nenhum projeto selecionado');
      return;
    }
    
    setIsGenerating(true);
    setProgress({ 
      currentStep: 1, 
      totalSteps: 5, 
      stepName: 'Gerando projeto com IA...', 
      progress: 20, 
      logs: [`Iniciando geração do projeto: ${currentProject.name}`] 
    });
    
    try {
      updateProject(currentProject.id, { status: 'creating' });
      
      console.log('🤖 Gerando projeto com IA...', request);
      const aiResponse = await aiService.generateProject(request);
      
      if (aiResponse.success) {
        setProgress({ 
          currentStep: 2, 
          totalSteps: 5, 
          stepName: 'Salvando arquivos...', 
          progress: 40, 
          logs: ['Projeto gerado com sucesso', `${aiResponse.files.length} arquivos criados`] 
        });
        
        updateProject(currentProject.id, { 
          files: aiResponse.files,
          status: 'testing'
        });
        
        terminalService.saveProjectLocally(currentProject.name, aiResponse.files);
        
        setProgress({ 
          currentStep: 3, 
          totalSteps: 5, 
          stepName: 'Testando projeto...', 
          progress: 60, 
          logs: ['Arquivos salvos localmente', 'Executando testes automáticos...'] 
        });
        
        const testResults = await aiService.testProject(aiResponse.files, request.language, request.framework);
        
        setProgress({ 
          currentStep: 4, 
          totalSteps: 5, 
          stepName: 'Configurando ambiente...', 
          progress: 80, 
          logs: ['Testes concluídos', 'Instalando dependências...'] 
        });
        
        await terminalService.installDependencies(request.language, request.framework);
        
        setProgress({ 
          currentStep: 5, 
          totalSteps: 5, 
          stepName: 'Projeto concluído!', 
          progress: 100, 
          logs: ['Dependências instaladas', 'Projeto pronto para desenvolvimento!'] 
        });
        
        updateProject(currentProject.id, { 
          status: 'completed',
          files: aiResponse.files
        });
        
        console.log('✅ Projeto gerado com sucesso!');
        console.log('📋 Resumo:', aiResponse.summary);
        console.log('🎯 Próximos passos:', aiResponse.nextSteps);
        
      } else {
        throw new Error(aiResponse.error || 'Erro desconhecido na geração');
      }
    } catch (error) {
      console.error('❌ Erro na geração:', error);
      updateProject(currentProject.id, { status: 'error' });
      setProgress({ 
        currentStep: 0, 
        totalSteps: 5, 
        stepName: 'Erro na geração', 
        progress: 0, 
        logs: ['Erro: ' + (error as Error).message] 
      });
    } finally {
      setIsGenerating(false);
      setTimeout(() => setProgress(null), 5000);
    }
  };

  const improveProject = async (feedback: string) => {
    if (!currentProject) {
      console.error('Nenhum projeto selecionado');
      return;
    }
    
    setIsGenerating(true);
    const persona = personas.find(p => p.id === currentProject.persona) || personas[0];
    
    try {
      console.log('⚡ Melhorando projeto com feedback:', feedback);
      const response = await aiService.improveProject(currentProject.files, feedback, persona);
      
      if (response.success) {
        updateProject(currentProject.id, { 
          files: response.files,
          updatedAt: new Date()
        });
        terminalService.saveProjectLocally(currentProject.name, response.files);
        console.log('✅ Projeto melhorado com sucesso!');
      }
    } catch (error) {
      console.error('❌ Erro ao melhorar projeto:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const testProject = async (): Promise<TestResult[]> => {
    if (!currentProject) {
      console.error('Nenhum projeto selecionado');
      return [];
    }
    
    try {
      console.log('🧪 Testando projeto:', currentProject.name);
      return await aiService.testProject(
        currentProject.files, 
        currentProject.language, 
        currentProject.framework
      );
    } catch (error) {
      console.error('❌ Erro ao testar projeto:', error);
      return [];
    }
  };

  const createPersona = async (description: string, stylePreferences: string, examples?: string) => {
    try {
      console.log('🎨 Criando nova persona...');
      const newPersona = await aiService.createPersona(description, stylePreferences, examples);
      setPersonas(prev => [...prev, newPersona]);
      console.log('✅ Nova persona criada:', newPersona.name);
    } catch (error) {
      console.error('❌ Erro ao criar persona:', error);
      throw error;
    }
  };

  const updatePersona = (id: string, updates: Partial<Persona>) => {
    setPersonas(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    console.log('⚙️ Persona atualizada:', id);
  };

  const deletePersona = (id: string) => {
    const persona = personas.find(p => p.id === id);
    setPersonas(prev => prev.filter(p => p.id !== id));
    console.log('🗑️ Persona deletada:', persona?.name);
  };

  const executeCommand = async (command: string): Promise<TerminalCommand> => {
    console.log('💻 Executando comando:', command);
    return await terminalService.executeCommand(command);
  };

  const getTerminalHistory = (): TerminalCommand[] => {
    return terminalService.getCommands();
  };

  const clearTerminal = () => {
    terminalService.clearHistory();
    console.log('🧹 Terminal limpo');
  };

  const deployProject = async (config: DeploymentConfig): Promise<VercelDeployment> => {
    if (!currentProject) {
      throw new Error('Nenhum projeto selecionado para deploy');
    }
    
    console.log(`🚀 Fazendo deploy para ${config.platform}...`);
    updateProject(currentProject.id, { status: 'deploying' });
    
    try {
      const deployment = await deployService.deployProject(
        currentProject.name,
        currentProject.files,
        config
      );
      
      updateProject(currentProject.id, { 
        status: 'completed',
        deploymentUrl: deployment.url
      });
      
      console.log('✅ Deploy concluído:', deployment.url);
      return deployment;
    } catch (error) {
      updateProject(currentProject.id, { status: 'error' });
      console.error('❌ Erro no deploy:', error);
      throw error;
    }
  };

  const getDeployments = (): VercelDeployment[] => {
    return deployService.getAllDeployments();
  };

  const updateFile = (path: string, content: string) => {
    if (!currentProject) {
      console.error('Nenhum projeto selecionado');
      return;
    }
    
    const updatedFiles = currentProject.files.map(file => 
      file.path === path 
        ? { ...file, content, lastModified: new Date() }
        : file
    );
    
    updateProject(currentProject.id, { files: updatedFiles });
    console.log('📝 Arquivo atualizado:', path);
  };

  const addFile = (file: ProjectFile) => {
    if (!currentProject) {
      console.error('Nenhum projeto selecionado');
      return;
    }
    
    const updatedFiles = [...currentProject.files, file];
    updateProject(currentProject.id, { files: updatedFiles });
    console.log('➕ Arquivo adicionado:', file.path);
  };

  const deleteFile = (path: string) => {
    if (!currentProject) {
      console.error('Nenhum projeto selecionado');
      return;
    }
    
    const updatedFiles = currentProject.files.filter(file => file.path !== path);
    updateProject(currentProject.id, { files: updatedFiles });
    console.log('🗑️ Arquivo deletado:', path);
  };

  const createCompleteProject = async (
    prompt: string, 
    language: string, 
    framework: string, 
    persona: Persona
  ) => {
    console.log('🎆 INICIANDO CRIAÇÃO COMPLETA E AUTOMÁTICA DO PROJETO!');
    console.log('📝 Descrição:', prompt);
    console.log('💻 Linguagem:', language);
    console.log('⚙️ Framework:', framework);
    console.log('🎨 Persona:', persona.name);
    
    setIsGenerating(true);
    setProgress({ 
      currentStep: 1, 
      totalSteps: 8, 
      stepName: 'Iniciando criação automática...', 
      progress: 12, 
      logs: ['Sistema de IA Builder ativado', 'Analisando requisitos...'] 
    });
    
    try {
      const projectName = `AI-Project-${Date.now()}`;
      createProject({
        name: projectName,
        description: prompt,
        language,
        framework,
        persona: persona.id
      });
      
      setProgress({ 
        currentStep: 2, 
        totalSteps: 8, 
        stepName: 'Gerando código com IA Gemini...', 
        progress: 25, 
        logs: ['Projeto criado na memória', 'Conectando com Gemini API...', 'Gerando código completo...'] 
      });
      
      const aiRequest: AIRequest = {
        prompt,
        projectType: 'webapp',
        language,
        framework,
        persona
      };
      
      const aiResponse = await aiService.generateProject(aiRequest);
      
      if (!aiResponse.success) {
        throw new Error(aiResponse.error || 'Falha na geração do código');
      }
      
      setProgress({ 
        currentStep: 3, 
        totalSteps: 8, 
        stepName: 'Criando estrutura de arquivos...', 
        progress: 37, 
        logs: [`Código gerado com sucesso - ${aiResponse.files.length} arquivos`, 'Criando estrutura de diretórios...', 'Salvando arquivos no sistema...'] 
      });
      
      await terminalService.createFiles(aiResponse.files, projectName);
      
      setProgress({ 
        currentStep: 4, 
        totalSteps: 8, 
        stepName: 'Instalando dependências...', 
        progress: 50, 
        logs: ['Estrutura de arquivos criada', 'Detectando dependências...', 'Executando npm/pip install...'] 
      });
      
      await terminalService.installDependencies(language, framework);
      
      setProgress({ 
        currentStep: 5, 
        totalSteps: 8, 
        stepName: 'Executando testes de qualidade...', 
        progress: 62, 
        logs: ['Dependências instaladas com sucesso', 'Analisando código...', 'Executando testes automáticos...'] 
      });
      
      const testResults = await aiService.testProject(aiResponse.files, language, framework);
      
      setProgress({ 
        currentStep: 6, 
        totalSteps: 8, 
        stepName: 'Configurando controle de versão (Git)...', 
        progress: 75, 
        logs: ['Testes de qualidade concluídos', 'Inicializando repositório Git...', 'Criando commit inicial...'] 
      });
      
      await terminalService.executeCommand('git init');
      await terminalService.executeCommand('git add .');
      await terminalService.executeCommand(`git commit -m "🚀 Initial commit: ${prompt}"`);
      
      setProgress({ 
        currentStep: 7, 
        totalSteps: 8, 
        stepName: 'Fazendo deploy na Vercel...', 
        progress: 87, 
        logs: ['Git configurado com sucesso', 'Preparando deploy para produção...', 'Enviando para Vercel...'] 
      });
      
      const deployConfig = deployService.generateDeployConfig('vercel', language, framework);
      const deployment = await deployService.deployProject(projectName, aiResponse.files, deployConfig);
      
      setProgress({ 
        currentStep: 8, 
        totalSteps: 8, 
        stepName: '✅ PROJETO FINALIZADO COM SUCESSO!', 
        progress: 100, 
        logs: [
          'Deploy realizado com sucesso!',
          `🌐 URL do projeto: ${deployment.url}`,
          '🎉 Projeto pronto para uso!',
          'O AI Builder automatizou todo o processo!'
        ] 
      });
      
      if (currentProject) {
        updateProject(currentProject.id, {
          files: aiResponse.files,
          status: 'completed',
          deploymentUrl: deployment.url
        });
      }
      
      console.log('🎆 =================================');
      console.log('🎉 PROJETO CRIADO COM SUCESSO!');
      console.log('🔗 URL:', deployment.url);
      console.log('📝 Resumo:', aiResponse.summary);
      console.log('🎯 Próximos passos:', aiResponse.nextSteps);
      console.log('🎆 =================================');
      
    } catch (error) {
      console.error('❌ ERRO NA CRIAÇÃO AUTOMÁTICA:', error);
      if (currentProject) {
        updateProject(currentProject.id, { status: 'error' });
      }
      setProgress({ 
        currentStep: 0, 
        totalSteps: 8, 
        stepName: 'Erro na criação automática', 
        progress: 0, 
        logs: ['Erro: ' + (error as Error).message, 'Tente novamente ou ajuste os parâmetros'] 
      });
    } finally {
      setIsGenerating(false);
      setTimeout(() => setProgress(null), 10000); // Mantém o progresso visível por 10 segundos
    }
  };

  const contextValue: AIBuilderContextType = {
    // Estado
    projects,
    currentProject,
    personas,
    progress,
    isGenerating,
    
    // Ações de Projeto
    createProject,
    selectProject,
    deleteProject,
    updateProject,
    
    // IA e Automação
    generateProjectWithAI,
    improveProject,
    testProject,
    createCompleteProject,
    
    // Personas
    createPersona,
    updatePersona,
    deletePersona,
    
    // Terminal
    executeCommand,
    getTerminalHistory,
    clearTerminal,
    
    // Deploy
    deployProject,
    getDeployments,
    
    // Arquivos
    updateFile,
    addFile,
    deleteFile
  };

  return (
    <AIBuilderContext.Provider value={contextValue}>
      {children}
    </AIBuilderContext.Provider>
  );
};

// Hook de conveniência para acessar funcionalidades específicas
export const useAI = () => {
  const { generateProjectWithAI, improveProject, testProject, createCompleteProject, isGenerating } = useAIBuilder();
  return { generateProjectWithAI, improveProject, testProject, createCompleteProject, isGenerating };
};

export const usePersonas = () => {
  const { personas, createPersona, updatePersona, deletePersona } = useAIBuilder();
  return { personas, createPersona, updatePersona, deletePersona };
};

export const useTerminal = () => {
  const { executeCommand, getTerminalHistory, clearTerminal } = useAIBuilder();
  return { executeCommand, getTerminalHistory, clearTerminal };
};

export const useDeploy = () => {
  const { deployProject, getDeployments } = useAIBuilder();
  return { deployProject, getDeployments };
};

