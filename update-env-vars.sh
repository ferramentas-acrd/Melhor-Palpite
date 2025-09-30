#!/bin/bash

# Script para atualizar variáveis de ambiente para URL canônica
# https://www.melhorpalpite.com.br

echo "🔧 Atualizando variáveis de ambiente..."

# Frontend .env
cat > /var/www/melhor-palpite/frontend/.env << 'EOF'
PUBLIC_STRAPI_URL=https://www.melhorpalpite.com.br
PUBLIC_SITE_URL=https://www.melhorpalpite.com.br
PUBLIC_API_URL=https://www.melhorpalpite.com.br/api
PUBLIC_UPLOADS_URL=https://www.melhorpalpite.com.br
PUBLIC_CANONICAL_URL=https://www.melhorpalpite.com.br
PUBLIC_ROUTE_PREFIX=apostas
PUBLIC_CONTENT_TYPE_PLURAL=posts
PUBLIC_CONTENT_TYPE_SINGULAR=post
EOF

# CMS .env
cat > /var/www/melhor-palpite/cms/.env << 'EOF'
HOST=0.0.0.0
PORT=1337
APP_KEYS=toBeModified1,toBeModified2,toBeModified3,toBeModified4
API_TOKEN_SALT=tobemodified
ADMIN_JWT_SECRET=tobemodified
TRANSFER_TOKEN_SALT=tobemodified
JWT_SECRET=tobemodified

# Database
DATABASE_CLIENT=mysql
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306
DATABASE_NAME=melhor_palpite
DATABASE_USERNAME=melhorpalpite
DATABASE_PASSWORD=MelhorP@lpite2025
DATABASE_SSL=false

# URLs
URL=https://www.melhorpalpite.com.br
PUBLIC_URL=https://www.melhorpalpite.com.br
PUBLIC_ADMIN_URL=https://www.melhorpalpite.com.br/admin
CDN_URL=https://www.melhorpalpite.com.br

# CORS
CORS_ENABLED=true
CORS_ORIGIN=https://www.melhorpalpite.com.br,https://melhorpalpite.com.br

# Security
NODE_ENV=production
STRAPI_DISABLE_UPDATE_NOTIFICATION=true
STRAPI_HIDE_STARTUP_MESSAGE=false
EOF

echo "✅ Variáveis de ambiente atualizadas!"