// Tipos base do projeto
export interface Project {
  id: string;
  name: string;
  description: string;
  language: string;
  framework: string;
  persona: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'creating' | 'testing' | 'deploying' | 'completed' | 'error';
  files: ProjectFile[];
  deploymentUrl?: string;
  gitRepository?: string;
}

export interface ProjectFile {
  path: string;
  content: string;
  language: string;
  size: number;
  lastModified: Date;
}

export interface Persona {
  id: string;
  name: string;
  description: string;
  style: PersonaStyle;
  customPrompt?: string;
  trainedBy?: string;
}

export interface PersonaStyle {
  colors: string[];
  fonts: string[];
  layout: 'minimal' | 'dynamic' | 'structured' | 'creative';
  spacing: 'compact' | 'balanced' | 'generous';
  animations?: boolean;
  shadows?: boolean;
  borderRadius?: 'none' | 'small' | 'medium' | 'large';
}

export interface AIRequest {
  prompt: string;
  projectType: string;
  language: string;
  framework: string;
  persona: Persona;
  additionalRequirements?: string[];
}

export interface AIResponse {
  success: boolean;
  files: ProjectFile[];
  summary: string;
  nextSteps: string[];
  testResults?: TestResult[];
  error?: string;
}

export interface TestResult {
  type: 'syntax' | 'functionality' | 'performance' | 'security';
  status: 'passed' | 'failed' | 'warning';
  message: string;
  details?: string;
}

export interface DeploymentConfig {
  platform: 'vercel' | 'netlify' | 'github-pages' | 'heroku';
  buildCommand?: string;
  outputDirectory?: string;
  environmentVariables?: Record<string, string>;
  customDomain?: string;
}

export interface TerminalCommand {
  id: string;
  command: string;
  output: string;
  status: 'running' | 'completed' | 'error';
  timestamp: Date;
}

export interface ProjectProgress {
  currentStep: number;
  totalSteps: number;
  stepName: string;
  progress: number;
  logs: string[];
}

export interface UserSettings {
  defaultLanguage: string;
  defaultFramework: string;
  preferredPersona: string;
  autoCommit: boolean;
  autoDeploy: boolean;
  customApiKeys: Record<string, string>;
}

// Interfaces para integração com APIs externas
export interface GeminiRequest {
  contents: {
    parts: {
      text: string;
    }[];
  }[];
  generationConfig?: {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
  };
}

export interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
    finishReason: string;
  }[];
}

export interface VercelDeployment {
  id: string;
  url: string;
  state: 'BUILDING' | 'READY' | 'ERROR';
  createdAt: number;
  buildingAt?: number;
  readyAt?: number;
}

