# Guia de Desenvolvimento - Métrica Construções

## 📋 Sumário

- [Começando](#começando)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Convenções de Código](#convenções-de-código)
- [Componentes](#componentes)
- [Animações](#animações)
- [Estilização](#estilização)
- [Performance](#performance)
- [Troubleshooting](#troubleshooting)

## 🚀 Começando

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:5173`

### Build

```bash
npm run build
npm run preview  # Para testar a build
```

## 📁 Estrutura do Projeto

```
src/
├── components/        # Componentes React
├── hooks/            # Custom hooks
├── utils/            # Funções utilitárias
├── constants/        # Constantes da aplicação
├── types/            # Tipos TypeScript
├── context/          # Contextos React
├── App.tsx           # Componente raiz
├── main.tsx          # Entry point
├── index.css         # Estilos globais
└── animations.css    # Animações customizadas
```

## 💻 Convenções de Código

### Componentes

**Padrão de nomenclatura**: PascalCase
**Arquivo**: TypeScript (.tsx)
**Exportação**: Named export

```typescript
export default function MyComponent() {
  return (
    <div>
      {/* JSX */}
    </div>
  )
}
```

### Variáveis

**Estado**: camelCase
**Constantes**: UPPER_SNAKE_CASE
**Privadas**: Prefixar com `_`

```typescript
const myVariable = 'value'
const CONSTANT_VALUE = 100
const _privateVariable = 'private'
```

### Props

Usar interface dedicada

```typescript
interface MyComponentProps {
  title: string
  count?: number
  onClick: () => void
}

export default function MyComponent({ title, count = 0, onClick }: MyComponentProps) {
  // Component code
}
```

## 🎨 Componentes

### Criando um novo componente

1. Criar arquivo em `src/components/MeuComponente.tsx`
2. Usar interface para props
3. Implementar com TypeScript
4. Exportar no App.tsx

```typescript
interface MeuComponenteProps {
  titulo: string
}

export default function MeuComponente({ titulo }: MeuComponenteProps) {
  return (
    <section className="py-24 px-4">
      <h2 className="text-4xl font-bold">{titulo}</h2>
    </section>
  )
}
```

### Componentes com Animações

Use Framer Motion para animações:

```typescript
import { motion } from 'framer-motion'

export default function AnimatedComponent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      Content
    </motion.div>
  )
}
```

## ✨ Animações

### Framer Motion Basics

**Variants** para reutilizar animações:

```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
}

// Usar
<motion.div variants={containerVariants}>
  {items.map((item) => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### WhileInView para Scroll Animations

```typescript
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true, margin: '-100px' }}
>
  Content
</motion.div>
```

### Hover Effects

```typescript
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Clique em mim
</motion.button>
```

## 🎨 Estilização

### Tailwind CSS

Usar classes de utilidade do Tailwind:

```typescript
<div className="flex items-center justify-between p-6 bg-white rounded-lg shadow-lg">
  <h3 className="text-xl font-bold text-gray-900">Título</h3>
</div>
```

### Paleta de Cores Customizada

Definida em `tailwind.config.js`:

- `primary`: Tons cinzento (principal)
- `accent`: Tons verdes (destaque)

Usar: `bg-primary-900`, `text-accent-600`, etc.

### Responsividade

Breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Responsivo */}
</div>
```

## ⚡ Performance

### Otimizações Implementadas

1. **Code Splitting**: Vite automático
2. **Tree Shaking**: Remover código não utilizado
3. **Image Lazy Loading**: Usar atributo `loading="lazy"`
4. **Memoization**: `useMemo`, `useCallback` quando necessário

### Práticas Recomendadas

```typescript
// ✅ Bom
const MyComponent = memo(function MyComponent(props) {
  return <div>{props.content}</div>
})

// ❌ Evitar
function ExpensiveComponent({ data }) {
  const processed = data.map(...) // Recalcula a cada render
  return <div>{processed}</div>
}

// ✅ Bom
function ExpensiveComponent({ data }) {
  const processed = useMemo(() => data.map(...), [data])
  return <div>{processed}</div>
}
```

## 🔍 Troubleshooting

### Componente não anima

**Problema**: Animações do Framer Motion não funcionam

**Solução**:
- Verificar se `motion` está importado
- Usar `whileInView` com `viewport={{ once: true }}`
- Testar com `animate` fixo primeiro

### Estilos não aplicam

**Problema**: Classes Tailwind não funcionam

**Solução**:
- Verificar se arquivo está em `src/`
- Verificar sintaxe do className
- Reiniciar dev server

### Build maior que esperado

**Problema**: Bundle size muito grande

**Solução**:
- Verificar duplicação de dependências
- Usar dynamic imports: `import()`
- Analisar com: `npm run build`

### Performance lenta em mobile

**Problema**: Scroll lento ou travos

**Solução**:
- Reduzir complexidade de animações
- Use `will-change` com moderação
- Considerar desabilitar animações para mobile

## 📚 Recursos

- [React Docs](https://react.dev)
- [Framer Motion](https://www.framer.com/motion)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Docs](https://vitejs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 🤝 Contribuindo

1. Seguir convenções de código
2. Escrever componentes reutilizáveis
3. Testar responsividade
4. Documentar funções complexas
5. Usar tipos TypeScript apropriados

---

**Última atualização**: May 11, 2026
