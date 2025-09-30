#!/bin/bash

# Script de Setup do Servidor Melhor Palpite
echo "==================================="
echo "INICIANDO SETUP DO MELHOR PALPITE"
echo "==================================="

# Atualizar sistema
echo "1. Atualizando sistema..."
sudo apt-get update -y
sudo apt-get upgrade -y

# Instalar dependências essenciais
echo "2. Instalando dependências..."
sudo apt-get install -y git curl wget build-essential nginx mysql-server

# Instalar Node.js 20
echo "3. Instalando Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2
echo "4. Instalando PM2..."
sudo npm install -g pm2

# Configurar MySQL
echo "5. Configurando MySQL..."
sudo systemctl start mysql
sudo systemctl enable mysql

# Criar banco de dados
sudo mysql -e "CREATE DATABASE IF NOT EXISTS melhor_palpite;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'melhorpalpite'@'localhost' IDENTIFIED BY 'MelhorP@lpite2025';"
sudo mysql -e "GRANT ALL PRIVILEGES ON melhor_palpite.* TO 'melhorpalpite'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

# Criar diretório do projeto
echo "6. Criando estrutura de diretórios..."
sudo mkdir -p /var/www/melhor-palpite
sudo chown -R ubuntu:ubuntu /var/www/melhor-palpite

# Clonar repositório
echo "7. Clonando repositório..."
cd /var/www/melhor-palpite
git clone https://github.com/ferramentas-acrd/Melhor-Palpite.git .

# Setup CMS
echo "8. Configurando CMS..."
cd /var/www/melhor-palpite/cms
npm install

# Criar arquivo .env do CMS
cat > .env << EOL
HOST=0.0.0.0
PORT=1337
APP_KEYS=toBeModified1,toBeModified2,toBeModified3,toBeModified4
API_TOKEN_SALT=tobemodified
ADMIN_JWT_SECRET=tobemodified
TRANSFER_TOKEN_SALT=tobemodified
DATABASE_CLIENT=mysql
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306
DATABASE_NAME=melhor_palpite
DATABASE_USERNAME=melhorpalpite
DATABASE_PASSWORD=MelhorP@lpite2025
DATABASE_SSL=false
JWT_SECRET=tobemodified
EOL

# Build do CMS
npm run build

# Setup Frontend
echo "9. Configurando Frontend..."
cd /var/www/melhor-palpite/frontend
npm install

# Criar arquivo .env do Frontend
cat > .env << EOL
PUBLIC_STRAPI_URL=http://localhost:1337
PUBLIC_CONTENT_TYPE=noticia
PUBLIC_CONTENT_TYPE_PLURAL=noticias
EOL

# Build do Frontend
npm run build

# Configurar PM2
echo "10. Configurando PM2..."
cd /var/www/melhor-palpite

# Criar ecosystem file
cat > ecosystem.config.js << 'EOL'
module.exports = {
  apps: [
    {
      name: "melhor-palpite-cms",
      script: "npm",
      args: "start",
      cwd: "/var/www/melhor-palpite/cms",
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "melhor-palpite-frontend",
      script: "npm",
      args: "run preview",
      cwd: "/var/www/melhor-palpite/frontend",
      env: {
        NODE_ENV: "production",
        HOST: "0.0.0.0",
        PORT: 4321
      }
    }
  ]
};
EOL

# Iniciar aplicações com PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u ubuntu --hp /home/ubuntu

# Configurar Nginx
echo "11. Configurando Nginx..."
sudo tee /etc/nginx/sites-available/melhor-palpite << 'EOL'
server {
    listen 80;
    server_name _;
    
    # Frontend
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
    
    # CMS Admin
    location /admin {
        proxy_pass http://localhost:1337/admin;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # API
    location /api {
        proxy_pass http://localhost:1337/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Uploads
    location /uploads {
        proxy_pass http://localhost:1337/uploads;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOL

# Ativar site
sudo ln -sf /etc/nginx/sites-available/melhor-palpite /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

# Configurar firewall
echo "12. Configurando firewall..."
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 1337/tcp
sudo ufw --force enable

echo "==================================="
echo "SETUP CONCLUÍDO COM SUCESSO!"
echo "==================================="
echo ""
echo "Informações de acesso:"
echo "- Frontend: http://$(curl -s ifconfig.me)"
echo "- CMS Admin: http://$(curl -s ifconfig.me)/admin"
echo "- API: http://$(curl -s ifconfig.me)/api"
echo ""
echo "Banco de dados MySQL:"
echo "- Database: melhor_palpite"
echo "- User: melhorpalpite"
echo "- Password: MelhorP@lpite2025"
echo ""
echo "Para verificar status:"
echo "- pm2 status"
echo "- pm2 logs"
echo ""