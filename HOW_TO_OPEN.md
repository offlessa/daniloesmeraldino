# 🚀 Como Abrir e Usar Este Projeto

## 📂 Localização do Projeto

```
C:\Users\FOCO ENGENHARIA\OneDrive\MARKETING\metrica\
```

## 🖥️ Abrindo no VS Code

### Opção 1: Arrastar & Soltar
1. Abra VS Code
2. Arraste a pasta `metrica` para dentro do VS Code

### Opção 2: Abrir Pasta
1. VS Code → File → Open Folder
2. Navegue até: `C:\Users\FOCO ENGENHARIA\OneDrive\MARKETING\metrica\`
3. Clique "Select Folder"

### Opção 3: Terminal
```bash
# No PowerShell
cd "C:\Users\FOCO ENGENHARIA\OneDrive\MARKETING\metrica"
code .
```

## ⚠️ Primeira Coisa Importante

**Node.js precisa estar instalado!**

Para verificar:
```bash
node --version
npm --version
```

Se não mostrar versão, [baixe Node.js aqui](https://nodejs.org) (versão 16+)

## 📋 Passo a Passo de Início

### 1. Abrir Terminal no VS Code

```
Ctrl + ` (backtick)
ou
View → Terminal
```

### 2. Instalar Dependências

```bash
npm install
```

Vai demorar alguns minutos na primeira vez. Deixe terminar.

### 3. Iniciar Dev Server

```bash
npm run dev
```

Você verá:
```
VITE v5.0.3 ready in XXX ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

### 4. Abrir no Navegador

Clique no link ou abra o navegador em `http://localhost:5173`

## 🎨 Arquivos Principais para Editar

### Para Trocar Informações da Empresa
📁 `src/constants/config.ts` - Todos os dados

### Para Mudar Textos
📁 `src/components/` - Edite cada componente

### Para Mudar Cores
📁 `tailwind.config.js` - Paleta de cores

### Para Mudar Imagens do Portfólio
📁 `src/components/Portfolio.tsx` - URLs das imagens

### Para Mudar Número de WhatsApp
🔍 Procure por: `5548988285002` (use Ctrl+Shift+F)

## 📱 Testando em Mobile

No navegador (DevTools):
1. Abra DevTools: `F12`
2. Clique ícone mobile (ou `Ctrl+Shift+M`)
3. Escolha dispositivo (iPhone, iPad, etc)

## 🛠️ Comandos Úteis

```bash
# Iniciar desenvolvimento (já abordado)
npm run dev

# Build para produção
npm run build

# Testar build localmente
npm run preview

# Formatar código
npm run format

# Verificar erros
npm run lint
```

## 📚 Documentação para Ler

**Na ordem de importância:**

1. 📄 **START_HERE.md** ← Leia PRIMEIRO (este arquivo)
2. 📄 **GETTING_STARTED.md** ← Customize em 5 minutos
3. 📄 **README.md** ← Overview completo
4. 📄 **DEVELOPMENT.md** ← Se vai desenvolver mais
5. 📄 **DEPLOYMENT.md** ← Para publicar online

## ❓ Dúvidas Comuns

### "O navegador não abre automaticamente"
→ Abra manualmente em http://localhost:5173

### "Erro: npm não reconhecido"
→ Node.js não está instalado. [Baixe aqui](https://nodejs.org)

### "Porta 5173 já está em uso"
→ Outro app usando. Feche outros vs codes ou use:
```bash
npm run dev -- --port 5174
```

### "Nenhuma mudança no navegador"
→ Faça refresh: `F5` ou `Ctrl+R`

### "Erro de módulo não encontrado"
→ Rode novamente: `npm install`

## 🎨 Customizações Básicas

### Trocar Número de WhatsApp

1. Abra `src/constants/config.ts`
2. Procure: `whatsapp: '5548988285002'`
3. Troque para seu número (exemplo: `'554733334444'`)
4. Salve (`Ctrl+S`)
5. Página atualiza automaticamente

### Trocar Cores

1. Abra `tailwind.config.js`
2. Na seção `colors`, edite os valores hex
3. Salve e veja a mudança em tempo real

### Trocar Textos

1. Abra arquivo do componente em `src/components/`
2. Procure pelo texto (use `Ctrl+F`)
3. Edite diretamente
4. Salve

## 🚀 Próximo Passo: Deploy

Quando estiver pronto para publicar:

1. Leia `DEPLOYMENT.md`
2. Escolha plataforma:
   - **Vercel** (recomendado para Vite)
   - **Netlify**
   - **GitHub Pages**
3. Siga as instruções

## 💾 Salvando Trabalho

O VS Code salva automaticamente, mas você pode:
```bash
Ctrl+S  ← Salvar arquivo
Ctrl+Shift+S ← Salvar como
```

## 🔄 Se Algo Quebrar

### Opção 1: Reiniciar Dev Server
```bash
# No terminal, pressione Ctrl+C para parar
# Depois rode novamente
npm run dev
```

### Opção 2: Limpar Cache
```bash
# Apague a pasta node_modules
rm -r node_modules

# Reinstale dependências
npm install

# Rode de novo
npm run dev
```

## 📞 Ajuda

- 📖 Leia a documentação (.md files)
- 🔍 Procure no Google
- 💬 Verifique comentários no código
- 🐛 Use DevTools do navegador (F12)

## ✅ Checklist Inicial

- [ ] Node.js instalado (`node -v` funciona)
- [ ] Pasta aberta no VS Code
- [ ] Terminal aberto (Ctrl+`)
- [ ] `npm install` executado
- [ ] `npm run dev` rodando
- [ ] Navegador abrindo em http://localhost:5173
- [ ] Vejo a landing page funcionando
- [ ] Posso editar e ver mudanças em tempo real

## 🎉 Tudo Funcionando?

Se chegou aqui, parabéns! 🎉

Agora você pode:
1. ✅ Customizar a landing page
2. ✅ Ver mudanças em tempo real
3. ✅ Publicar online depois

**Divirta-se desenvolvendo!** 🚀

---

**Precisa de ajuda?** Leia os arquivos .md inclusos ou Google é seu melhor amigo 😊
