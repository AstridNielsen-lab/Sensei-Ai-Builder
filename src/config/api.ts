// Configuração da API Gemini
export const API_CONFIG = {
  GEMINI_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent',
  GEMINI_API_KEY: 'AIzaSyAV6k7MxnZWDe_APYW2XO8PV2QfjrcTtqE',
  VERCEL_API_URL: 'https://api.vercel.com',
};

// Configuração de automação completa
export const AUTOMATION_CONFIG = {
  AUTO_EXECUTE_COMMANDS: true,
  AUTO_CREATE_PROJECTS: true,
  AUTO_TESTING: true,
  AUTO_DEPLOYMENT: true,
  AUTO_GIT_COMMITS: true,
  POWERSHELL_INTEGRATION: true,
  LOCAL_STORAGE_PERSISTENCE: true,
  REAL_TIME_PROGRESS: true
};

// Configurações do projeto
export const PROJECT_CONFIG = {
  DEFAULT_TIMEOUT: 30000,
  MAX_RETRIES: 3,
  SUPPORTED_LANGUAGES: [
    'javascript', 'typescript', 'python', 'java', 'csharp', 'php', 'ruby',
    'go', 'rust', 'cpp', 'html', 'css', 'react', 'vue', 'angular', 'svelte',
    'nextjs', 'nuxtjs', 'express', 'fastapi', 'django', 'laravel', 'rails'
  ],
  SUPPORTED_FRAMEWORKS: [
    'react', 'vue', 'angular', 'svelte', 'nextjs', 'nuxtjs', 'gatsby',
    'express', 'fastapi', 'django', 'laravel', 'rails', 'spring', 'asp.net'
  ],
  DEPLOYMENT_PLATFORMS: ['vercel', 'netlify', 'github-pages', 'heroku']
};

// Personas padrão
export const DEFAULT_PERSONAS = [
  {
    id: 'modern-minimalist',
    name: 'Minimalista Moderno',
    description: 'Design limpo e moderno com foco na simplicidade',
    style: {
      colors: ['#000000', '#FFFFFF', '#F5F5F5', '#E0E0E0'],
      fonts: ['Inter', 'Roboto', 'Poppins'],
      layout: 'minimal',
      spacing: 'generous'
    }
  },
  {
    id: 'vibrant-creative',
    name: 'Criativo Vibrante',
    description: 'Design colorido e criativo com elementos dinâmicos',
    style: {
      colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
      fonts: ['Montserrat', 'Open Sans', 'Lato'],
      layout: 'dynamic',
      spacing: 'compact'
    }
  },
  {
    id: 'professional-corporate',
    name: 'Corporativo Profissional',
    description: 'Design profissional para empresas e negócios',
    style: {
      colors: ['#2C3E50', '#3498DB', '#FFFFFF', '#ECF0F1'],
      fonts: ['Source Sans Pro', 'Lato', 'Roboto'],
      layout: 'structured',
      spacing: 'balanced'
    }
  }
];

