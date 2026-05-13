# Métrica Construções - Landing Page

Landing page moderna, sofisticada e responsiva para Métrica Construções - empresa especializada em construção residencial de alto padrão, construção comercial, gerenciamento de obras, reformas e projetos turnkey em Tubarão - SC.

## 🎨 Características

- **Design Premium e Minimalista**: Paleta sofisticada com branco, preto, verde escuro acinzentado e tons neutros
- **Totalmente Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Animações Suaves**: Implementado com Framer Motion para experiência fluida
- **Otimizado para Conversão**: Múltiplos CTAs para gerar leads via WhatsApp
- **Componentes Reutilizáveis**: Estrutura modular e limpa
- **Tailwind CSS**: Estilização moderna e eficiente
- **Performance**: Otimizado com Vite para carga rápida

## 🚀 Stack Tecnológico

- **React 18.3** - Biblioteca UI
- **TypeScript** - Tipagem de código
- **Vite** - Build tool de próxima geração
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Biblioteca de animações
- **Lucide React** - Ícones modernos

## 📦 Instalação

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn

### Passo 1: Instalar dependências

```bash
npm install
```

### Passo 2: Rodas em desenvolvimento

```bash
npm run dev
```

A aplicação abrirá automaticamente em `http://localhost:5173`

### Passo 3: Build para produção

```bash
npm run build
```

### Passo 4: Preview da build

```bash
npm run preview
```

## 📁 Estrutura do Projeto

```
metrica/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx           # Barra de navegação
│   │   ├── Hero.tsx             # Seção hero principal
│   │   ├── Authority.tsx        # Seção de diferenciais
│   │   ├── Portfolio.tsx        # Portfólio de projetos
│   │   ├── Process.tsx          # Processo de trabalho
│   │   ├── About.tsx            # Sobre a empresa
│   │   ├── Testimonials.tsx     # Depoimentos de clientes
│   │   ├── CTA.tsx              # Call to action final
│   │   └── Footer.tsx           # Rodapé
│   ├── App.tsx                  # Componente principal
│   ├── main.tsx                 # Entry point
│   └── index.css                # Estilos globais
├── index.html                   # HTML template
├── package.json                 # Dependências
├── vite.config.ts              # Configuração Vite
├── tsconfig.json               # Configuração TypeScript
├── tailwind.config.js          # Configuração Tailwind
├── postcss.config.js           # Configuração PostCSS
└── .gitignore                  # Git ignore
```

## 🎯 Seções da Landing Page

### 1. **Navbar**
- Logo da empresa
- Menu de navegação
- CTA "Solicitar Orçamento"
- Menu responsivo para mobile
- Efeito de scroll (muda cor ao descer)

### 2. **Hero Section**
- Headline forte: "Construções de Alto Padrão"
- Subheadline descritivo
- Botões CTA primário e secundário
- Gradient background sofisticado
- Indicador de scroll animado

### 3. **Authority (Diferenciais)**
- 6 cards com ícones dos serviços
- Estatísticas da empresa (15+ anos, 100+ projetos, etc.)
- Design minimalista com hover effects

### 4. **Portfolio**
- Grid de 6 projetos com imagens
- Hover elegante com overlay
- Categorias (Residencial, Comercial, Reforma)
- Links para detalhes dos projetos

### 5. **Process**
- 4 etapas do atendimento
- Layout alternado (esquerda/direita)
- Animações de entrada
- Timeline visual
- Cronograma típico

### 6. **About**
- Texto institucional elegante
- 4 cards informativos (Localização, Equipe, Projetos, Experiência)
- CTA para consulta gratuita
- Background gradiente premium

### 7. **Testimonials**
- 4 depoimentos de clientes
- Avaliações com estrelas
- Fotos dos clientes (avatares dinâmicos)
- Estatísticas de satisfação

### 8. **CTA Final**
- Chamada forte para ação
- Botão WhatsApp prominente
- Telefone como alternativa
- Lista de benefícios

### 9. **Footer**
- Links rápidos
- Informações de contato
- Redes sociais
- Links legais
- Botão scroll to top

## 🎨 Paleta de Cores

```css
Primary (Cinza Escuro):
- 50: #f9faf8
- 900: #0f0e0c

Accent (Verde Acinzentado):
- 400: #50bcc4
- 600: #1f8970
- 700: #166857
```

## 🔧 Customização

### Número de WhatsApp
Edite o número nos componentes (procure por `wa.me/554832345678`):

```tsx
href="https://wa.me/SEU_NUMERO?text=Olá"
```

### Textos e Conteúdo
Todos os textos estão nos componentes - basta encontrar e editar conforme necessário.

### Imagens
As imagens do portfólio usam placeholder do Unsplash. Substitua os URLs pelos seus próprios:

```tsx
image: 'https://images.unsplash.com/...'
```

### Cores
Edite `tailwind.config.js`:

```js
colors: {
  primary: { /* suas cores */ },
  accent: { /* suas cores */ },
}
```

## 📱 Responsividade

A landing page é totalmente responsiva com breakpoints:
- Mobile: até 640px
- Tablet: 641px - 1024px  
- Desktop: 1025px+

## ⚡ Performance

- Vite garante builds rápidos
- Code splitting automático
- Tailwind CSS purga CSS não utilizado
- Otimização de imagens recomendada

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### GitHub Pages
Configurar em `vite.config.ts`:
```js
base: '/metrica/',
```

## 📝 Boas Práticas Implementadas

✅ Componentes modularizados e reutilizáveis  
✅ TypeScript para type safety  
✅ Animações performáticas com Framer Motion  
✅ Imagens otimizadas com loading lazy  
✅ Acessibilidade (ARIA labels, semântica HTML)  
✅ Código limpo e bem organizado  
✅ Responsividade mobile-first  
✅ SEO básico implementado  

## 📞 Contato

**Métrica Construções**
- WhatsApp: (48) 3234-5678
- Email: contato@metrica.com.br
- Endereço: Rua Principal, 1000 - Tubarão - SC

## 📄 Licença

Todos os direitos reservados © 2024 Métrica Construções
