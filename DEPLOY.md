# Deploy Instructions - AI Website Builder

## Preparação para Deploy no Vercel

### 1. Configuração Local
O projeto já está configurado com:
- ✅ `vercel.json` otimizado para SPA React
- ✅ Build command configurado (`npm run build`)
- ✅ Output directory definido (`dist`)
- ✅ `.vercelignore` para uploads otimizados
- ✅ Headers de segurança configurados

### 2. Comandos para Deploy

#### Opção A: Deploy via CLI do Vercel
```bash
# Instalar Vercel CLI (se não tiver)
npm install -g vercel

# Login no Vercel
vercel login

# Deploy (primeira vez)
vercel

# Deploy para produção
vercel --prod
```

#### Opção B: Deploy via Git (Recomendado)
1. Conecte seu repositório ao Vercel:
   - Acesse https://vercel.com
   - Clique em "New Project"
   - Conecte seu repositório GitHub/GitLab/Bitbucket

2. Configure as seguintes opções:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (raiz do projeto)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 3. Variáveis de Ambiente
Caso você tenha variáveis de ambiente, adicione no painel do Vercel:
- Acesse o projeto no dashboard
- Vá em Settings > Environment Variables
- Adicione as variáveis necessárias

### 4. Domínio Personalizado (Opcional)
Para configurar um domínio próprio:
1. Vá em Settings > Domains
2. Adicione seu domínio
3. Configure os DNS conforme instruções

### 5. Solução de Problemas Comuns

#### Erro "Missing public directory"
- ✅ **Resolvido**: Output directory configurado corretamente como `dist`

#### Erro "Missing build script"
- ✅ **Resolvido**: Build script definido no `package.json`

#### Rotas não funcionam (404)
- ✅ **Resolvido**: SPA routing configurado no `vercel.json`

#### Problemas de cache
- ✅ **Resolvido**: Headers de cache otimizados configurados

### 6. Verificações Finais
Antes do deploy, execute:
```bash
# Limpar build anterior
rm -rf dist

# Build de produção
npm run build

# Verificar se arquivos foram gerados
ls dist/
```

### 7. URLs Importantes
- **Dashboard**: https://vercel.com/dashboard
- **Documentação**: https://vercel.com/docs
- **Status**: https://vercel-status.com

---

## Estrutura do Projeto Configurada

```
ai-website-builder/
├── dist/                 # Build output (gerado automaticamente)
├── src/                  # Código fonte
├── package.json          # ✅ Scripts de build configurados
├── vercel.json           # ✅ Configuração do Vercel otimizada
├── .vercelignore         # ✅ Arquivos ignorados no upload
├── vite.config.ts        # ✅ Configuração de build otimizada
└── DEPLOY.md            # Este arquivo
```

## Status da Configuração
- ✅ Build funcionando
- ✅ Output directory correto
- ✅ SPA routing configurado
- ✅ Headers de segurança
- ✅ Cache otimizado
- ✅ Upload otimizado

**O projeto está pronto para deploy!** 🚀

