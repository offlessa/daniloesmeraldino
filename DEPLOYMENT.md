# Guia de Deploy e Manutenção

## 🚀 Deployment

### Preparação

1. Build de produção
```bash
npm run build
```

2. Testar build local
```bash
npm run preview
```

3. Verificar erros de build
```bash
npm run build -- --mode production
```

## 🌐 Plataformas de Deploy

### Vercel (Recomendado para Vite + React)

**Vantagens**: Deployment automático, servidor otimizado, preview automático

1. Conectar repositório GitHub
2. Importar projeto
3. Configurações automáticas para Vite
4. Deploy automático em push

**Variáveis de ambiente** (.env.production):
```
VITE_WHATSAPP_NUMBER=554832345678
VITE_COMPANY_EMAIL=contato@metrica.com.br
```

### Netlify

**Setup local**:
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod --dir=dist
```

**netlify.toml**:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### GitHub Pages

**vite.config.ts**:
```typescript
export default {
  base: '/metrica/',
}
```

**Deploy com GitHub Actions**:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Docker

**Dockerfile**:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "preview"]
```

## 🔒 Segurança

### Checklist de Segurança

- [ ] Remover dados sensíveis de commits
- [ ] Usar `.env` para secrets
- [ ] HTTPS em produção
- [ ] Headers de segurança configurados
- [ ] CORS configurado corretamente
- [ ] Sanitizar inputs de usuário
- [ ] Atualizar dependências regularmente

### Dependências

```bash
# Verificar vulnerabilidades
npm audit

# Corrigir automaticamente
npm audit fix

# Atualizar dependências
npm update

# Check for outdated packages
npm outdated
```

## 📊 Monitoramento

### Google Analytics (Opcional)

Adicionar ao HTML:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Lighthouse

```bash
# Audit de performance
npm run build
npm run preview
# Abrir DevTools > Lighthouse
```

**Metas**:
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

## 🔧 Manutenção

### Atualização de Conteúdo

**Informações da empresa** - Editar `src/constants/config.ts`
**Portfólio** - Editar array em config.ts ou criar banco de dados
**Textos** - Editar componentes individuais

### Backup

```bash
# Backup do repositório
git clone --mirror https://github.com/user/repo.git
# ou usar GitHub backup automático
```

### Logs de Erro

Configurar error tracking:
- Sentry: `npm install @sentry/react`
- LogRocket: `npm install logrocket`
- Rollbar: `npm install rollbar`

## 📱 Testes

### Responsividade

Testar em breakpoints:
- [ ] Mobile (320px - 480px)
- [ ] Tablet (481px - 768px)
- [ ] Desktop (769px+)

### Browsers

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers

### Funcionalidade

```bash
# Testes (se implementados)
npm run test
npm run test:e2e
```

## 📈 SEO

### Meta Tags

Já configurados em `index.html`:
```html
<meta name="description" content="...">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### Structured Data

Adicionar JSON-LD para melhor SEO:
```typescript
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Métrica Construções",
  "url": "https://metrica-construcoes.com.br",
  "telephone": "+55-48-3234-5678",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rua Principal, 1000",
    "addressLocality": "Tubarão",
    "addressRegion": "SC",
    "postalCode": "88015-200"
  }
}
</script>
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
    
    - run: npm ci
    - run: npm run build
    - run: npm run preview &
    - run: sleep 5

  deploy:
    needs: build-and-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    - run: npm ci
    - run: npm run build
    - name: Deploy to production
      run: npm run deploy:prod
```

## 🆘 Troubleshooting de Deploy

### Página em branco em produção

**Solução**:
- Verificar console do navegador (DevTools)
- Verificar Network tab para erros 404
- Testar com `npm run preview`
- Verificar path do `base` em vite.config.ts

### Estilos não carregam

**Solução**:
- Hard refresh (Ctrl+Shift+R)
- Limpar cache do navegador
- Verificar MIME types do servidor
- Testar com nginx/Apache config

### Animações travadas

**Solução**:
- Verificar performance com DevTools
- Reduzir número de elementos animados
- Usar `will-change` com moderação
- Considerar desabilitar para mobile

## 📞 Suporte

**Contato para issues**:
- WhatsApp: (48) 3234-5678
- Email: contato@metrica.com.br

---

**Última atualização**: May 11, 2026
**Versão**: 1.0.0
