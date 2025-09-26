#!/bin/bash

set -e

echo "============================================"
echo "   DEPLOY CORINTHIANS ONLINE - PRODUÇÃO    "
echo "============================================"
date

# Verificar se o user-data já foi executado
echo "=== Verificando status do sistema ==="
if ! command -v docker &> /dev/null; then
    echo "Docker não encontrado. Aguardando instalação..."
    sleep 60
fi

# Verificar MySQL
echo "=== Verificando MySQL ==="
if docker ps | grep -q mysql-corinthians; then
    echo "✓ MySQL rodando"
else
    echo "× MySQL não encontrado. Iniciando..."
    docker run -d \
      --name mysql-corinthians \
      -e MYSQL_ROOT_PASSWORD=CorinthiansDB2025! \
      -e MYSQL_DATABASE=corinthians_online \
      -e MYSQL_USER=corinthians_user \
      -e MYSQL_PASSWORD=Timao2025Campeao! \
      -p 3306:3306 \
      -v /data/mysql:/var/lib/mysql \
      --restart always \
      mysql:8.0
    
    echo "Aguardando MySQL inicializar..."
    sleep 30
fi

# Clonar projeto
echo "=== Clonando projeto ==="
cd /var/www
if [ -d "corinthians-online" ]; then
    echo "Projeto já existe. Atualizando..."
    cd corinthians-online
    git pull origin main || true
else
    git clone https://github.com/ferramentas-acrd/corinthians-online.git
    cd corinthians-online
fi

# Configurar CMS
echo "=== Configurando CMS Strapi ==="
cd /var/www/corinthians-online/cms

# Criar arquivo .env do CMS
cat > .env << 'EOF'
HOST=0.0.0.0
PORT=1337
APP_KEYS=toBeModified1,toBeModified2
API_TOKEN_SALT=tobemodified
ADMIN_JWT_SECRET=tobemodified
JWT_SECRET=tobemodified

# Database
DATABASE_CLIENT=mysql
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=corinthians_online
DATABASE_USERNAME=corinthians_user
DATABASE_PASSWORD=Timao2025Campeao!
DATABASE_SSL=false

NODE_ENV=production
EOF

# Instalar dependências e build
echo "=== Instalando dependências do CMS ==="
npm install

echo "=== Build do CMS ==="
npm run build

# Configurar Frontend
echo "=== Configurando Frontend Astro ==="
cd /var/www/corinthians-online/frontend

# Criar arquivo .env do Frontend
cat > .env << 'EOF'
PUBLIC_STRAPI_URL=http://localhost:1337
PUBLIC_CONTENT_TYPE=noticia
PUBLIC_CONTENT_TYPE_PLURAL=noticias
NODE_ENV=production
EOF

# Instalar dependências e build
echo "=== Instalando dependências do Frontend ==="
npm install

echo "=== Build do Frontend ==="
npm run build

# Criar arquivo ecosystem PM2
echo "=== Configurando PM2 ==="
cd /var/www/corinthians-online

cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'strapi-cms',
      cwd: '/var/www/corinthians-online/cms',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 1337
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      log_date_format: 'YYYY-MM-DD HH:mm:ss'
    },
    {
      name: 'astro-frontend',
      cwd: '/var/www/corinthians-online/frontend',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 4321,
        HOST: '0.0.0.0'
      },
      instances: 2,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      log_date_format: 'YYYY-MM-DD HH:mm:ss'
    }
  ]
};
EOF

# Parar processos PM2 existentes
pm2 stop all || true
pm2 delete all || true

# Iniciar aplicações com PM2
echo "=== Iniciando aplicações com PM2 ==="
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u ec2-user --hp /home/ec2-user || true

# Configurar Nginx
echo "=== Configurando Nginx ==="
sudo tee /etc/nginx/conf.d/corinthians.conf > /dev/null << 'EOF'
server {
    listen 80;
    server_name corinthiansonline.com www.corinthiansonline.com _;
    client_max_body_size 100M;

    # Frontend (Astro)
    location / {
        proxy_pass http://localhost:4321;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Strapi API
    location /api {
        rewrite ^/api/(.*)$ /api/$1 break;
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Strapi Admin
    location /admin {
        proxy_pass http://localhost:1337/admin;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Media files
    location /uploads {
        proxy_pass http://localhost:1337/uploads;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Compressão
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/css text/javascript text/xml text/plain application/javascript application/json application/xml;
}
EOF

# Remover configuração default do nginx
sudo rm -f /etc/nginx/sites-enabled/default || true

# Reiniciar Nginx
echo "=== Reiniciando Nginx ==="
sudo nginx -t
sudo systemctl restart nginx

# Verificar status
echo "=== Verificando status dos serviços ==="
pm2 status
docker ps
sudo systemctl status nginx --no-pager

echo ""
echo "============================================"
echo "   DEPLOY CONCLUÍDO COM SUCESSO!          "
echo "============================================"
echo ""
echo "Acesse:"
echo "  - Frontend: http://18.212.79.230"
echo "  - Admin Strapi: http://18.212.79.230/admin"
echo ""
echo "Logs:"
echo "  - PM2: pm2 logs"
echo "  - Nginx: sudo tail -f /var/log/nginx/error.log"
echo ""
date