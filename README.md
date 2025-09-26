# Corinthians Online

A casa de apostas oficial da Fiel Torcida. Portal de apostas esportivas dedicado à torcida corinthiana.

## 🚀 Tecnologias

- **Frontend:** Astro 5.13.10 + TypeScript + Tailwind CSS
- **CMS:** Strapi 5
- **Database:** SQLite (desenvolvimento) / MySQL (produção)
- **Infrastructure:** AWS EC2, Cloudflare, Nginx

## 📁 Estrutura do Projeto

```
Diario do Futebol/
├── frontend/          # Astro Application
│   ├── src/
│   │   ├── pages/     # Astro Pages
│   │   ├── components/# Astro Components
│   │   ├── layouts/   # Page Layouts
│   │   └── lib/       # Utilities & API
│   └── package.json
├── cms/               # Strapi CMS
│   ├── src/
│   │   └── api/       # Content Types
│   └── package.json
└── README.md
```

## 🌟 Funcionalidades

### Páginas Implementadas
- **Homepage** (`/`) - Página inicial com últimas notícias
- **Apostas** (`/apostas`) - Seção de apostas esportivas
- **Palpites** (`/palpites`) - Prognósticos e análises
- **Times** (`/times/[slug]`) - Páginas específicas de times

### Recursos
- Design responsivo baseado no Figma
- Integração completa com Strapi CMS
- Sistema de categorias e tags
- Área de apostas e casas recomendadas
- Seção de vídeos e conteúdo multimídia
- SEO otimizado

## 🛠️ Desenvolvimento Local

### Pré-requisitos
- Node.js 20.19.4+
- npm ou yarn

### Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/[username]/diario-do-futebol.git
cd "Diario do Futebol"
```

2. **Instale dependências:**
```bash
# Frontend
cd frontend
npm install

# CMS
cd ../cms
npm install
```

3. **Configure variáveis de ambiente:**
```bash
# Em frontend/.env.local
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_token_here
```

4. **Inicie os serviços:**
```bash
# Terminal 1 - Strapi CMS
cd cms
npm run develop

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### URLs de Desenvolvimento
- **Frontend:** http://localhost:4321
- **Strapi Admin:** http://localhost:1337/admin

## 📊 Content Types (Strapi)

- **Articles** - Notícias e artigos
- **Categories** - Categorias de conteúdo
- **Tags** - Tags para organização
- **Teams** - Informações de times

## 🎨 Design

O projeto segue a identidade visual do Corinthians Online, com:
- Cores principais: Preto, Branco e Roxo (#8B5CF6)
- Logo "SC" em destaque
- Tipografia: Inter
- Layout responsivo e moderno
- Componentes baseados no Tailwind CSS

## 🚀 Deploy

### Produção
- **Frontend:** Vercel/AWS EC2
- **CMS:** AWS EC2 com Nginx
- **Database:** MySQL
- **CDN:** Cloudflare

### Configuração de Produção
```bash
# Build frontend
npm run build

# Build Strapi
npm run build
npm run start
```

## 📝 Páginas Planejadas

- `/` - Homepage
- `/apostas/` - Categoria Apostas
- `/palpites/` - Categoria Palpites  
- `/apostas/melhores-casas-de-apostas/` - Artigo específico
- `/times/cruzeiro/` - Página do time

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

Para suporte e dúvidas, entre em contato através dos issues do GitHub.

---

**Corinthians Online** - A casa de apostas oficial da Fiel Torcida ⚽🏟️