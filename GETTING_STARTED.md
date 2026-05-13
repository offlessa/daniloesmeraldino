# 🚀 Começando com a Landing Page Métrica Construções

## 📋 Pré-requisitos

Você precisa ter instalado:
- **Node.js** 16+ (Baixar em [nodejs.org](https://nodejs.org))
- **npm** ou **yarn** (vem com Node.js)
- **Git** (opcional, para versionamento)
- **VS Code** (recomendado) ou outro editor

## ⚡ Instalação Rápida (5 minutos)

### 1️⃣ Instalar Dependências

```bash
npm install
```

Isto instalará todas as bibliotecas necessárias (React, Vite, Tailwind, etc).

### 2️⃣ Iniciar Servidor de Desenvolvimento

```bash
npm run dev
```

O navegador abrirá automaticamente em `http://localhost:5173`

### 3️⃣ Começar a Desenvolver

Edite os arquivos e veja as mudanças em tempo real! 🎉

## 📝 Customizações Essenciais

### 1. Informações da Empresa

Edite `src/constants/config.ts`:

```typescript
export const COMPANY = {
  name: 'Métrica Construções',
  phone: '+554832345678', // SEU NÚMERO
  email: 'contato@metrica.com.br', // SEU EMAIL
  // ... outras informações
}
```

### 2. Número de WhatsApp

O número aparece em vários lugares. Procure por:
- `554832345678` (sem símbolos)
- `(48) 3234-5678` (formatado)

E substitua por SEU número. Está usado em:
- `Navbar.tsx`
- `Hero.tsx`
- `Portfolio.tsx`
- `About.tsx`
- `CTA.tsx`
- `Footer.tsx`

### 3. Conteúdo de Texto

Edite diretamente nos componentes:
- **Títulos**: Procure por tags `<h1>`, `<h2>`, etc
- **Descrições**: Procure por tags `<p>`
- **Botões**: Procure por `<button>` ou `<a>`

Exemplo em `Hero.tsx`:
```typescript
<h1>Construções de Alto Padrão</h1> // ← Editar aqui
```

### 4. Imagens do Portfólio

Em `src/components/Portfolio.tsx`, substitua os URLs:

```typescript
image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80'
```

Por suas próprias imagens. Pode usar:
- Suas fotos locais (adicionar em `public/images/`)
- URLs de serviços como Unsplash, Pexels, Pixabay
- CDN próprio

### 5. Cores Personalizadas

Edite `tailwind.config.js`:

```javascript
colors: {
  primary: {
    900: '#0f0e0c', // ← Mudar cores aqui
    // ... outros tons
  },
  accent: {
    600: '#1f8970', // ← Verde customizado
    // ... outros tons
  },
}
```

### 6. Depoimentos de Clientes

Em `src/components/Testimonials.tsx`, atualize:

```typescript
const testimonials = [
  {
    name: 'Seu Cliente',
    company: 'Sua Empresa',
    text: 'Seu depoimento aqui...',
    rating: 5,
    image: 'https://...',
  },
  // ... mais depoimentos
]
```

## 🏗️ Estrutura do Projeto

```
metrica/
├── src/
│   ├── components/        ← Seções da página
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── Authority.tsx
│   │   ├── Portfolio.tsx
│   │   ├── Process.tsx
│   │   ├── About.tsx
│   │   ├── Testimonials.tsx
│   │   ├── CTA.tsx
│   │   └── Footer.tsx
│   ├── constants/         ← Dados da empresa
│   │   └── config.ts
│   ├── hooks/            ← Funções customizadas
│   ├── utils/            ← Auxiliares
│   ├── types/            ← Tipos TypeScript
│   ├── context/          ← Estado global
│   ├── App.tsx           ← Componente principal
│   ├── main.tsx          ← Início da app
│   └── index.css         ← Estilos globais
├── index.html            ← Arquivo HTML
├── package.json          ← Dependências
├── vite.config.ts        ← Configuração Vite
├── tailwind.config.js    ← Tailwind customização
└── README.md             ← Documentação
```

## 🎨 Personalizando Componentes

### Mudar cores de um component

```typescript
// Antes
<div className="bg-accent-600">

// Depois (outra cor)
<div className="bg-accent-700">
```

[Cores disponíveis](tailwind.config.js): primary-50 até primary-900, accent-50 até accent-900

### Mudar tamanho de fontes

```typescript
// Antes
<h1 className="text-4xl">

// Depois (maior)
<h1 className="text-6xl">

// Ou menor
<h1 className="text-2xl">
```

### Mudar espaçamento

```typescript
// Antes (espaço médio)
<div className="p-6">

// Depois (mais espaço)
<div className="p-12">

// Ou menos
<div className="p-3">
```

## 🎬 Entendendo as Animações

Todas usam **Framer Motion**. Exemplo:

```typescript
// Fade in ao entrar na tela
<motion.div
  initial={{ opacity: 0 }}           // ← Estado inicial (escondido)
  whileInView={{ opacity: 1 }}      // ← Quando entra na tela
  transition={{ duration: 0.6 }}     // ← Duração (segundos)
>
  Seu conteúdo
</motion.div>
```

Para desabilitar animações em mobile:

```typescript
import { useBreakpoint } from '@/hooks/useCustom'

const breakpoint = useBreakpoint()
const shouldAnimate = breakpoint !== 'sm'

<motion.div
  initial={shouldAnimate ? { opacity: 0 } : undefined}
  animate={shouldAnimate ? { opacity: 1 } : undefined}
>
  {/* ... */}
</motion.div>
```

## 🔧 Comandos Úteis

```bash
# Iniciar desenvolvimento
npm run dev

# Build para produção
npm run build

# Testar build localmente
npm run preview

# Verificar erros TypeScript
npm run type-check

# Formatar código
npm run format

# Verificar erros ESLint
npm run lint
```

## 📱 Testando Responsividade

1. Abra DevTools (`F12` ou `Cmd+Shift+I`)
2. Clique ícone de dispositivo (mobile icon)
3. Teste em diferentes tamanhos:
   - **Mobile**: 375px (iPhone)
   - **Tablet**: 768px (iPad)
   - **Desktop**: 1024px+

Ou redimensione a janela manualmente.

## 🚀 Próximas Etapas

### Fase 1: Setup (Hoje)
- ✅ Instalar dependências
- ✅ Rodar dev server
- ✅ Ver tudo funcionando

### Fase 2: Customização
- [ ] Atualizar textos e títulos
- [ ] Mudar número de WhatsApp
- [ ] Adicionar suas imagens
- [ ] Atualizar cores (opcional)
- [ ] Customizar depoimentos

### Fase 3: Conteúdo
- [ ] Adicionar projetos reais
- [ ] Atualizar estatísticas
- [ ] Adicionar depoimentos reais
- [ ] Revisar todas as informações

### Fase 4: Deploy
- [ ] Fazer build: `npm run build`
- [ ] Testar build: `npm run preview`
- [ ] Deploy em Vercel/Netlify
- [ ] Configurar domínio
- [ ] Ativar HTTPS

## 💡 Dicas Práticas

### 🔍 Encontrar algo na página?
Use `Ctrl+F` (ou `Cmd+F`) para procurar o texto

### 🎨 Não tem certeza sobre cores?
Teste diferentes valores em `tailwind.config.js` até achar a que gosta

### 📸 Onde conseguir imagens?
- [Unsplash](https://unsplash.com) - Livre
- [Pexels](https://pexels.com) - Livre
- [Pixabay](https://pixabay.com) - Livre
- Suas próprias fotos

### ⚡ Página lenta?
1. Reduzir tamanho das imagens
2. Usar formatos modernos (WebP)
3. Verificar Lighthouse no DevTools

### 🐛 Algo quebrou?
1. Verificar console (DevTools)
2. Verificar espaçamento no código (indentação)
3. Verificar aspas e parênteses
4. Ver DEVELOPMENT.md para troubleshooting

## 📞 Suporte

Se tiver dúvidas:
1. Verifique `README.md` - Documentação geral
2. Verifique `DEVELOPMENT.md` - Guia de desenvolvimento
3. Verifique `DEPLOYMENT.md` - Para publicar online

## 🎓 Aprendendo Mais

- **React**: [react.dev](https://react.dev)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)
- **Framer Motion**: [framer.com/motion](https://www.framer.com/motion)
- **TypeScript**: [typescriptlang.org](https://www.typescriptlang.org)

## ✅ Checklist Final

Antes de publicar, verifique:

- [ ] Todas as informações da empresa estão corretas
- [ ] Número de WhatsApp está atualizado
- [ ] Email de contato está correto
- [ ] Imagens do portfólio são suas
- [ ] Depoimentos são reais
- [ ] Links de redes sociais funcionam
- [ ] Página está responsiva (testou em mobile?)
- [ ] Sem erros no console do navegador
- [ ] Build executa sem erros (`npm run build`)

## 🎉 Pronto!

Parabéns! Você tem uma landing page moderna e profissional.

**Próximo passo**: Fazer deploy em Vercel/Netlify seguindo `DEPLOYMENT.md`

---

**Precisa de ajuda?**
- WhatsApp: (48) 3234-5678
- Email: contato@metrica.com.br
- Leia a documentação completa em README.md

**Boa sorte! 🚀**
