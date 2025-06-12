import { TerminalCommand, ProjectFile } from '../types';

class TerminalService {
  private commands: TerminalCommand[] = [];
  private currentDirectory = 'C:\\';

  // Simula execução de comandos PowerShell no browser
  async executeCommand(command: string): Promise<TerminalCommand> {
    const terminalCommand: TerminalCommand = {
      id: Date.now().toString(),
      command,
      output: '',
      status: 'running',
      timestamp: new Date()
    };

    this.commands.push(terminalCommand);

    try {
      // Simula diferentes comandos
      let output = '';
      
      if (command.startsWith('cd ')) {
        const newDir = command.replace('cd ', '').trim();
        this.currentDirectory = newDir;
        output = `Diretório alterado para: ${newDir}`;
      }
      else if (command === 'pwd') {
        output = this.currentDirectory;
      }
      else if (command.startsWith('mkdir ')) {
        const dirName = command.replace('mkdir ', '').trim();
        output = `Diretório '${dirName}' criado com sucesso`;
      }
      else if (command.startsWith('git init')) {
        output = 'Repositório Git inicializado';
      }
      else if (command.startsWith('git add')) {
        output = 'Arquivos adicionados ao staging';
      }
      else if (command.startsWith('git commit')) {
        const message = command.match(/-m "([^"]+)"/)?.[1] || 'Initial commit';
        output = `[main ${this.generateCommitHash()}] ${message}\n${Math.floor(Math.random() * 50)} files changed, ${Math.floor(Math.random() * 1000)} insertions(+)`;
      }
      else if (command.startsWith('git push')) {
        output = 'Enumerating objects: 35, done.\nCounting objects: 100% (35/35), done.\nWriting objects: 100% (35/35), done.\nTotal 35 (delta 0), reused 0 (delta 0)\nTo github.com:user/repo.git\n * [new branch]      main -> main';
      }
      else if (command.startsWith('npm install') || command.startsWith('yarn install')) {
        output = 'Instalando dependências...\n✓ Dependências instaladas com sucesso\n✓ Packages instalados: ' + Math.floor(Math.random() * 500) + ' packages';
      }
      else if (command.startsWith('npm run') || command.startsWith('yarn')) {
        const script = command.split(' ').pop();
        output = `Executando script '${script}'...\n✓ Build concluído com sucesso\n✓ Output gerado em 'dist/'`;
      }
      else if (command.startsWith('python ')) {
        output = 'Executando aplicação Python...\n✓ Servidor iniciado em http://localhost:8000';
      }
      else if (command.startsWith('node ')) {
        output = 'Executando aplicação Node.js...\n✓ Servidor iniciado em http://localhost:3000';
      }
      else if (command.includes('vercel deploy')) {
        output = 'Deploying to Vercel...\n✓ Deployment successful\n✓ URL: https://app-' + this.generateRandomId() + '.vercel.app';
      }
      else if (command.startsWith('ls') || command.startsWith('dir')) {
        output = 'package.json\npackage-lock.json\nsrc/\npublic/\nREADME.md\n.gitignore';
      }
      else {
        // Comando genérico
        output = `Comando '${command}' executado com sucesso`;
      }
      
      // Simula delay de execução
      await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));
      
      terminalCommand.output = output;
      terminalCommand.status = 'completed';
      
    } catch (error) {
      terminalCommand.output = `Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`;
      terminalCommand.status = 'error';
    }

    return terminalCommand;
  }

  async setupProject(projectName: string, language: string, framework: string): Promise<TerminalCommand[]> {
    const commands: string[] = [];
    
    // Cria diretório do projeto
    commands.push(`mkdir "${projectName}"`);
    commands.push(`cd "${projectName}"`);
    
    // Comandos específicos por linguagem/framework
    if (framework === 'react') {
      commands.push('npx create-react-app . --template typescript');
    } else if (framework === 'vue') {
      commands.push('npm create vue@latest .');
    } else if (framework === 'angular') {
      commands.push('ng new . --routing --style=css');
    } else if (framework === 'nextjs') {
      commands.push('npx create-next-app@latest . --typescript --tailwind --eslint');
    } else if (language === 'python') {
      commands.push('python -m venv venv');
      commands.push('pip install flask fastapi uvicorn');
    } else if (language === 'node' || language === 'javascript') {
      commands.push('npm init -y');
      commands.push('npm install express');
    }
    
    // Inicializa Git
    commands.push('git init');
    commands.push('git add .');
    commands.push('git commit -m "Initial commit"');
    
    const results: TerminalCommand[] = [];
    
    for (const cmd of commands) {
      const result = await this.executeCommand(cmd);
      results.push(result);
    }
    
    return results;
  }

  async createFiles(files: ProjectFile[], baseDir: string = this.currentDirectory): Promise<TerminalCommand[]> {
    const results: TerminalCommand[] = [];
    
    for (const file of files) {
      // Simula criação de arquivo
      const createDirCmd = `mkdir -p "${this.getDirPath(file.path)}"`;
      const createFileCmd = `echo 'Arquivo criado: ${file.path}'`;
      
      if (this.getDirPath(file.path) !== '.') {
        const dirResult = await this.executeCommand(createDirCmd);
        results.push(dirResult);
      }
      
      const fileResult = await this.executeCommand(createFileCmd);
      results.push(fileResult);
      
      // Salva arquivo no localStorage para persistência
      const fullPath = `${baseDir}/${file.path}`;
      localStorage.setItem(`file:${fullPath}`, file.content);
    }
    
    return results;
  }

  async installDependencies(language: string, framework: string): Promise<TerminalCommand> {
    let command = 'npm install';
    
    if (language === 'python') {
      command = 'pip install -r requirements.txt';
    } else if (language === 'php') {
      command = 'composer install';
    } else if (language === 'ruby') {
      command = 'bundle install';
    } else if (language === 'go') {
      command = 'go mod tidy';
    }
    
    return await this.executeCommand(command);
  }

  async runProject(language: string, framework: string): Promise<TerminalCommand> {
    let command = 'npm start';
    
    if (framework === 'nextjs') {
      command = 'npm run dev';
    } else if (framework === 'vue') {
      command = 'npm run serve';
    } else if (language === 'python') {
      command = 'python app.py';
    } else if (language === 'go') {
      command = 'go run main.go';
    } else if (language === 'php') {
      command = 'php -S localhost:8000';
    }
    
    return await this.executeCommand(command);
  }

  async deployToVercel(projectName: string): Promise<TerminalCommand> {
    const commands = [
      'npm run build',
      'vercel --prod'
    ];
    
    let combinedOutput = '';
    
    for (const cmd of commands) {
      const result = await this.executeCommand(cmd);
      combinedOutput += result.output + '\n';
    }
    
    return {
      id: Date.now().toString(),
      command: 'Deploy to Vercel',
      output: combinedOutput,
      status: 'completed',
      timestamp: new Date()
    };
  }

  getCommands(): TerminalCommand[] {
    return this.commands;
  }

  clearHistory(): void {
    this.commands = [];
  }

  getCurrentDirectory(): string {
    return this.currentDirectory;
  }

  private getDirPath(filePath: string): string {
    const parts = filePath.split('/');
    parts.pop(); // Remove filename
    return parts.length > 0 ? parts.join('/') : '.';
  }

  private generateCommitHash(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  private generateRandomId(): string {
    return Math.random().toString(36).substring(2, 10);
  }

  // Métodos para persistência local
  saveProjectLocally(projectName: string, files: ProjectFile[]): void {
    const projectData = {
      name: projectName,
      files,
      savedAt: new Date().toISOString()
    };
    
    localStorage.setItem(`project:${projectName}`, JSON.stringify(projectData));
    
    // Atualiza lista de projetos salvos
    const savedProjects = this.getSavedProjects();
    if (!savedProjects.includes(projectName)) {
      savedProjects.push(projectName);
      localStorage.setItem('savedProjects', JSON.stringify(savedProjects));
    }
  }

  getSavedProjects(): string[] {
    const saved = localStorage.getItem('savedProjects');
    return saved ? JSON.parse(saved) : [];
  }

  loadProject(projectName: string): { name: string; files: ProjectFile[]; savedAt: string } | null {
    const data = localStorage.getItem(`project:${projectName}`);
    return data ? JSON.parse(data) : null;
  }

  deleteProject(projectName: string): void {
    localStorage.removeItem(`project:${projectName}`);
    
    const savedProjects = this.getSavedProjects();
    const updated = savedProjects.filter(name => name !== projectName);
    localStorage.setItem('savedProjects', JSON.stringify(updated));
  }
}

export const terminalService = new TerminalService();

