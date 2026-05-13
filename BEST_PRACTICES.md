# 🎯 Boas Práticas e Padrões de Código

## 📋 Índice

1. [Componentes](#componentes)
2. [Estilos](#estilos)
3. [Animações](#animações)
4. [Tipos TypeScript](#tipos-typescript)
5. [Performance](#performance)
6. [Segurança](#segurança)
7. [Acessibilidade](#acessibilidade)
8. [Git & Commits](#git--commits)

---

## 🎨 Componentes

### Estrutura Padrão

```typescript
// src/components/MyComponent.tsx

import { motion } from 'framer-motion'
import { useBreakpoint } from '@/hooks/useCustom'
import { classNames } from '@/utils/helpers'
import type { MyComponentProps } from '@/types'

/**
 * Descrição do componente
 * Responsável por...
 */
export default function MyComponent({
  title,
  children,
  className,
}: MyComponentProps) {
  const breakpoint = useBreakpoint()
  const isMobile = breakpoint === 'sm'

  return (
    <motion.section
      className={classNames('py-24 px-4', className)}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: '-100px' }}
    >
      {/* Conteúdo */}
    </motion.section>
  )
}
```

### Boas Práticas

✅ **Fazer**
- Usar TypeScript para todas as props
- Documentar com comentários de função
- Quebrar componentes em partes menores
- Usar `motion` do Framer para animações
- Exportar como `default export`

❌ **Não Fazer**
- Lógica complexa dentro de componentes (usar hooks)
- Estilos inline (usar Tailwind)
- Props sem tipos
- Múltiplos exports por arquivo

---

## 🎨 Estilos

### Usando Tailwind CSS

```typescript
// ✅ Bom - Usar classes Tailwind
<div className="flex items-center justify-between p-6 bg-white rounded-lg shadow-lg">
  <h1 className="text-2xl font-bold text-primary-900">Título</h1>
</div>

// ❌ Ruim - CSS inline
<div style={{ display: 'flex', padding: '24px' }}>

// ✅ Bom - Responsividade
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

// ✅ Bom - Estados
<button className="hover:bg-accent-700 active:scale-95 transition-all">
  Clique aqui
</button>
```

### Paleta de Cores

Sempre usar cores definidas em `tailwind.config.js`:

```typescript
// ✅ Bom
<div className="bg-primary-900 text-accent-600">

// ❌ Ruim
<div className="bg-gray-900 text-green-600">

// Tons disponíveis: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900
```

### Responsive Design

```typescript
// Mobile first
<div className="
  flex flex-col             // ← Mobile
  md:flex-row               // ← Tablet
  lg:gap-12                 // ← Desktop
  text-sm md:text-base      // ← Font responsivo
">
  Conteúdo
</div>
```

---

## 🎬 Animações

### Padrão com Framer Motion

```typescript
import { motion } from 'framer-motion'

// Variantes reutilizáveis
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

// Usar em componente
<motion.div
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: '-100px' }}
>
  {items.map((item) => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### Tipos de Animação

```typescript
// Fade In
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}

// Slide Up
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}

// Scale
initial={{ scale: 0.8 }}
animate={{ scale: 1 }}

// Rotate
initial={{ rotate: 0 }}
animate={{ rotate: 360 }}

// Combo
initial={{ opacity: 0, y: 20, scale: 0.9 }}
animate={{ opacity: 1, y: 0, scale: 1 }}
```

### Hover Effects

```typescript
<motion.button
  whileHover={{ 
    scale: 1.05,
    backgroundColor: '#166857'
  }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: 'spring', stiffness: 400 }}
>
  Clique aqui
</motion.button>
```

---

## 📝 Tipos TypeScript

### Definir Interfaces

```typescript
// ✅ Bom - Interface específica
interface ProjectCardProps {
  title: string
  description: string
  image: string
  category: 'Residencial' | 'Comercial'
  onViewDetails: () => void
}

// ❌ Ruim - Type genérico
type Props = {
  [key: string]: any
}
```

### Usar Union Types

```typescript
type DeviceType = 'mobile' | 'tablet' | 'desktop'
type Status = 'pending' | 'success' | 'error'

const handleDevice = (device: DeviceType) => {
  switch(device) {
    case 'mobile':
      // ...
      break
  }
}
```

### Reutilizar Types

```typescript
// src/types/index.ts
export interface Project {
  id: number
  title: string
  category: string
}

// src/components/ProjectCard.tsx
import type { Project } from '@/types'

interface ProjectCardProps {
  project: Project
}
```

---

## ⚡ Performance

### Memoization

```typescript
import { memo, useMemo, useCallback } from 'react'

// ✅ Memoizar componente pesado
const HeavyComponent = memo(function HeavyComponent({ data }) {
  return <div>{/* render complexo */}</div>
})

// ✅ Memoizar valores computados
const Component = ({ items }) => {
  const sorted = useMemo(() => {
    return items.sort((a, b) => a.name.localeCompare(b.name))
  }, [items])

  // ✅ Memoizar callbacks
  const handleClick = useCallback(() => {
    // handler logic
  }, [dependencies])

  return <div>{sorted.length}</div>
}
```

### Code Splitting

```typescript
// ✅ Lazy load heavy components
import { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  )
}
```

### Image Optimization

```typescript
// ✅ Usar lazy loading
<img 
  src="image.jpg" 
  alt="Description"
  loading="lazy"
  width={800}
  height={600}
/>

// ✅ Usar srcset para responsive
<img
  src="image.jpg"
  srcSet="image-sm.jpg 640w, image-md.jpg 1024w"
  sizes="(max-width: 640px) 100vw, 1024px"
  alt="Description"
/>
```

---

## 🔒 Segurança

### Validar Inputs

```typescript
// ✅ Validar email
import { isValidEmail } from '@/utils/helpers'

const handleSubmit = (email: string) => {
  if (!isValidEmail(email)) {
    throw new Error('Email inválido')
  }
  // proceder
}

// ✅ Validar telefone
import { isValidBrazilianPhone } from '@/utils/helpers'
```

### Usar Environment Variables

```typescript
// ✅ Bom - Usar env vars
const API_URL = import.meta.env.VITE_API_URL

// ❌ Ruim - Hardcoding
const API_URL = 'https://api.example.com'

// .env
VITE_API_URL=https://api.example.com
```

### Sanitizar Dados

```typescript
// ✅ Bom - Sanitizar HTML
import DOMPurify from 'dompurify'

const cleanHTML = DOMPurify.sanitize(userInput)

// ✅ Bom - Escapar valores
<div>{escapeHtml(userContent)}</div>
```

---

## ♿ Acessibilidade

### Semântica HTML

```typescript
// ✅ Bom - Tags semânticas
<main>
  <article>
    <h1>Título</h1>
    <p>Conteúdo</p>
  </article>
</main>

// ❌ Ruim - Divs genéricos
<div>
  <div>Título</div>
  <div>Conteúdo</div>
</div>
```

### ARIA Labels

```typescript
// ✅ Bom - ARIA label
<button aria-label="Fechar menu">
  <X size={24} />
</button>

// ✅ Bom - Form labels
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// ✅ Bom - Alt text
<img src="image.jpg" alt="Descrição da imagem" />
```

### Keyboard Navigation

```typescript
// ✅ Bom - Navegação por teclado
<button onClick={handleClick} onKeyDown={handleKeyDown}>
  Clique aqui
</button>

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    handleClick()
  }
}

// ✅ Bom - Tab order
<button tabIndex={1}>Primeiro</button>
<button tabIndex={2}>Segundo</button>
```

---

## 🔧 Git & Commits

### Padrão de Commits

```bash
# ✅ Bom
git commit -m "feat: add new portfolio section"
git commit -m "fix: navbar scroll effect on mobile"
git commit -m "refactor: extract button component"
git commit -m "docs: add deployment guide"
git commit -m "perf: optimize image loading"

# ❌ Ruim
git commit -m "atualizando"
git commit -m "consertos"
git commit -m "xxx"
```

### Tipos de Commit

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `refactor:` - Refatoração sem mudança funcional
- `perf:` - Melhoria de performance
- `docs:` - Documentação
- `style:` - Formatação/estilo
- `test:` - Testes
- `chore:` - Tarefas (deps, config)

### Branch Naming

```bash
# ✅ Bom
git checkout -b feat/new-testimonials-section
git checkout -b fix/navbar-mobile-menu
git checkout -b refactor/button-component

# ❌ Ruim
git checkout -b feature
git checkout -b fix
git checkout -b test
```

---

## 📋 Checklist Antes de Commit

- [ ] Código está funcionando sem erros
- [ ] Sem `console.log` ou debug statements
- [ ] TypeScript não tem erros (`npm run type-check`)
- [ ] ESLint passa (`npm run lint`)
- [ ] Código está formatado (`npm run format`)
- [ ] Componentes reutilizáveis quando possível
- [ ] Acessibilidade verificada (keyboard, screen reader)
- [ ] Responsividade testada (mobile, tablet, desktop)
- [ ] Performance aceitável (DevTools Lighthouse)
- [ ] Documentação atualizada se necessário

---

## 🔄 Review Checklist

Ao revisar código, verificar:

- [ ] Segue padrões do projeto
- [ ] Sem código duplicado
- [ ] Tipos TypeScript corretos
- [ ] Sem warnings de ESLint
- [ ] Performance adequada
- [ ] Acessibilidade respeitada
- [ ] Sem dados sensíveis expostos
- [ ] Testes quando necessário
- [ ] Documentação clara
- [ ] Commits bem escritos

---

## 📚 Referências

- [React Best Practices](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref)
- [Git Best Practices](https://git-scm.com/book/en/v2)

---

**Última atualização**: May 11, 2026
**Versão**: 1.0.0
