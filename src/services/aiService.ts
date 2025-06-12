import { API_CONFIG, PROJECT_CONFIG } from '../config/api';
import { 
  AIRequest, 
  AIResponse, 
  GeminiRequest, 
  GeminiResponse, 
  ProjectFile,
  TestResult,
  Persona
} from '../types';

class AIService {
  private async callGeminiAPI(prompt: string): Promise<string> {
    const requestBody: GeminiRequest = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192
      }
    };

    try {
      const response = await fetch(`${API_CONFIG.GEMINI_URL}?key=${API_CONFIG.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      const data: GeminiResponse = await response.json();
      
      if (data.candidates && data.candidates.length > 0) {
        return data.candidates[0].content.parts[0].text;
      }
      
      throw new Error('No response from AI');
    } catch (error) {
      console.error('Erro ao chamar API Gemini:', error);
      throw error;
    }
  }

  private createProjectPrompt(request: AIRequest): string {
    const { prompt, projectType, language, framework, persona, additionalRequirements } = request;
    
    return `
Você é um desenvolvedor expert em TODAS as linguagens de programação e frameworks. Crie um projeto completo e funcional baseado nas especificações abaixo:

**ESPECIFICAÇÕES DO PROJETO:**
- Descrição: ${prompt}
- Tipo: ${projectType}
- Linguagem: ${language}
- Framework: ${framework}
- Persona de Design: ${persona.name} - ${persona.description}
- Cores: ${persona.style.colors.join(', ')}
- Fontes: ${persona.style.fonts.join(', ')}
- Layout: ${persona.style.layout}
- Espaçamento: ${persona.style.spacing}
${additionalRequirements ? `- Requisitos adicionais: ${additionalRequirements.join(', ')}` : ''}

**INSTRUÇÕES:**
1. Crie um projeto COMPLETO e FUNCIONAL
2. Inclua TODOS os arquivos necessários (HTML, CSS, JS, config files, package.json, etc.)
3. O código deve estar PRONTO PARA EXECUÇÃO sem erros
4. Aplique o design da persona especificada
5. Inclua funcionalidades modernas e melhores práticas
6. Adicione comentários explicativos no código
7. Crie estrutura de pastas organizada

**FORMATO DE RESPOSTA:**
Responda em JSON com esta estrutura exata:
{
  "files": [
    {
      "path": "caminho/do/arquivo",
      "content": "conteudo completo do arquivo",
      "language": "linguagem do arquivo"
    }
  ],
  "summary": "Resumo detalhado do que foi criado",
  "nextSteps": ["próximos passos para execução"],
  "buildCommands": ["comandos para build/instalação"],
  "runCommands": ["comandos para execução"]
}

**IMPORTANTE:**
- Crie código REAL e FUNCIONAL, não placeholders
- Inclua TODOS os arquivos necessários
- Use as melhores práticas da linguagem/framework
- O projeto deve rodar imediatamente após instalação das dependências
`;
  }

  private createTestPrompt(files: ProjectFile[], language: string, framework: string): string {
    const filesList = files.map(f => `${f.path}: ${f.language}`).join('\n');
    
    return `
Você é um especialista em testes e qualidade de código. Analise o projeto abaixo e crie testes abrangentes:

**ARQUIVOS DO PROJETO:**
${filesList}

**LINGUAGEM:** ${language}
**FRAMEWORK:** ${framework}

**TAREFAS:**
1. Analise a sintaxe de todos os arquivos
2. Verifique se há erros de funcionalidade
3. Avalie performance e segurança
4. Crie testes unitários e de integração
5. Sugira melhorias

**FORMATO DE RESPOSTA:**
Responda em JSON:
{
  "testResults": [
    {
      "type": "syntax|functionality|performance|security",
      "status": "passed|failed|warning",
      "message": "mensagem do teste",
      "details": "detalhes adicionais"
    }
  ],
  "testFiles": [
    {
      "path": "caminho/arquivo/teste",
      "content": "código do teste",
      "language": "linguagem"
    }
  ],
  "improvements": ["sugestões de melhoria"],
  "summary": "resumo da análise"
}
`;
  }

  async generateProject(request: AIRequest): Promise<AIResponse> {
    try {
      console.log('🤖 Gerando projeto com IA...', request);
      
      const prompt = this.createProjectPrompt(request);
      const response = await this.callGeminiAPI(prompt);
      
      // Parse da resposta JSON
      const cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      const aiData = JSON.parse(cleanResponse);
      
      const files: ProjectFile[] = aiData.files.map((file: any) => ({
        path: file.path,
        content: file.content,
        language: file.language,
        size: file.content.length,
        lastModified: new Date()
      }));
      
      return {
        success: true,
        files,
        summary: aiData.summary,
        nextSteps: aiData.nextSteps || [],
        testResults: []
      };
    } catch (error) {
      console.error('Erro ao gerar projeto:', error);
      return {
        success: false,
        files: [],
        summary: 'Erro ao gerar projeto',
        nextSteps: [],
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  async testProject(files: ProjectFile[], language: string, framework: string): Promise<TestResult[]> {
    try {
      console.log('🧪 Testando projeto...', { language, framework });
      
      const prompt = this.createTestPrompt(files, language, framework);
      const response = await this.callGeminiAPI(prompt);
      
      const cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      const testData = JSON.parse(cleanResponse);
      
      return testData.testResults || [];
    } catch (error) {
      console.error('Erro ao testar projeto:', error);
      return [{
        type: 'functionality',
        status: 'error',
        message: 'Erro durante os testes',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      }];
    }
  }

  async improveProject(files: ProjectFile[], feedback: string, persona: Persona): Promise<AIResponse> {
    try {
      console.log('⚡ Melhorando projeto com feedback...', feedback);
      
      const filesInfo = files.map(f => `${f.path}:\n${f.content}`).join('\n\n---\n\n');
      
      const prompt = `
Você é um desenvolvedor expert. Melhore o projeto baseado no feedback:

**FEEDBACK:** ${feedback}

**PROJETO ATUAL:**
${filesInfo}

**PERSONA:** ${persona.name} - ${persona.description}

**INSTRUÇÕES:**
1. Aplique as melhorias solicitadas
2. Mantenha a consistência do design
3. Melhore performance e qualidade
4. Adicione funcionalidades se necessário

Responda no mesmo formato JSON anterior com os arquivos atualizados.
`;
      
      const response = await this.callGeminiAPI(prompt);
      const cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      const aiData = JSON.parse(cleanResponse);
      
      const updatedFiles: ProjectFile[] = aiData.files.map((file: any) => ({
        path: file.path,
        content: file.content,
        language: file.language,
        size: file.content.length,
        lastModified: new Date()
      }));
      
      return {
        success: true,
        files: updatedFiles,
        summary: aiData.summary,
        nextSteps: aiData.nextSteps || []
      };
    } catch (error) {
      console.error('Erro ao melhorar projeto:', error);
      return {
        success: false,
        files,
        summary: 'Erro ao aplicar melhorias',
        nextSteps: [],
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  async createPersona(description: string, stylePreferences: string, examples?: string): Promise<Persona> {
    try {
      console.log('🎨 Criando nova persona...', description);
      
      const prompt = `
Crie uma nova persona de design baseada na descrição:

**DESCRIÇÃO:** ${description}
**PREFERÊNCIAS:** ${stylePreferences}
${examples ? `**EXEMPLOS:** ${examples}` : ''}

**INSTRUÇÕES:**
1. Crie uma persona única e coerente
2. Defina paleta de cores harmonyônica
3. Escolha fontes apropriadas
4. Defina estilo de layout
5. Configure espaçamentos

Responda em JSON:
{
  "id": "id-único",
  "name": "Nome da Persona",
  "description": "Descrição detalhada",
  "style": {
    "colors": ["#cor1", "#cor2", "#cor3", "#cor4"],
    "fonts": ["fonte1", "fonte2", "fonte3"],
    "layout": "minimal|dynamic|structured|creative",
    "spacing": "compact|balanced|generous",
    "animations": true|false,
    "shadows": true|false,
    "borderRadius": "none|small|medium|large"
  },
  "customPrompt": "prompt personalizado para esta persona"
}
`;
      
      const response = await this.callGeminiAPI(prompt);
      const cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      const personaData = JSON.parse(cleanResponse);
      
      return {
        ...personaData,
        trainedBy: 'user'
      };
    } catch (error) {
      console.error('Erro ao criar persona:', error);
      throw new Error('Falha ao criar persona personalizada');
    }
  }
}

export const aiService = new AIService();

