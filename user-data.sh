#!/bin/bash
# User Data Script para Corinthians Online

# Log todas as ações
exec > >(tee /var/log/user-data.log)
exec 2>&1

echo "=== Iniciando configuração da instância ==="
date

# Atualizar sistema
echo "=== Atualizando sistema ==="
yum update -y

# Instalar Docker
echo "=== Instalando Docker ==="
yum install -y docker git
systemctl start docker
systemctl enable docker
usermod -a -G docker ec2-user

# Instalar Node.js 20
echo "=== Instalando Node.js 20 ==="
curl -sL https://rpm.nodesource.com/setup_20.x | bash -
yum install -y nodejs

# Verificar versões
node --version
npm --version

# Instalar PM2 globalmente
echo "=== Instalando PM2 ==="
npm install -g pm2

# Instalar nginx
echo "=== Instalando Nginx ==="
yum install -y nginx
systemctl start nginx
systemctl enable nginx

# Criar diretórios necessários
echo "=== Criando diretórios ==="
mkdir -p /var/www/corinthians-online
mkdir -p /var/log/corinthians
mkdir -p /data/mysql
mkdir -p /backup

# Configurar swap (importante para t3.large)
echo "=== Configurando swap ==="
dd if=/dev/zero of=/swapfile bs=128M count=32
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo "/swapfile swap swap defaults 0 0" >> /etc/fstab

# Instalar MySQL via Docker
echo "=== Instalando MySQL via Docker ==="
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

# Aguardar MySQL iniciar
echo "=== Aguardando MySQL iniciar ==="
sleep 30

# Instalar ferramentas adicionais
echo "=== Instalando ferramentas adicionais ==="
yum install -y htop vim tmux

# Configurar permissões
chown -R ec2-user:ec2-user /var/www/corinthians-online
chown -R ec2-user:ec2-user /var/log/corinthians

echo "=== Configuração inicial concluída ==="
date