# 🚀 GUIA DE DEPLOY AWS - CORINTHIANS ONLINE

## 📋 Configuração Recomendada da Instância EC2

### 1️⃣ **CONFIGURAÇÕES BÁSICAS**

#### **Nome e Tags**
```
Nome: corinthiansonline-server-aws
Tags adicionais:
  - Environment: production
  - Project: corinthians-online
  - Type: web-application
  - Stack: nodejs-strapi-mysql
```

#### **AMI (Amazon Machine Image)**
✅ **RECOMENDADO**: `Amazon Linux 2023 AMI`
- AMI ID: ami-089b82f1c5bf93d976
- Arquitetura: 64-bit (x86)
- Última versão com suporte de longo prazo

### 2️⃣ **TIPO DE INSTÂNCIA**

Para um portal de notícias com tráfego médio-alto, recomendo:

#### **OPÇÃO 1 - INÍCIO (Desenvolvimento/Teste)**
```
Tipo: t3.medium
vCPUs: 2
Memória: 4 GiB
Preço: ~$0.0416/hora
```

#### **OPÇÃO 2 - PRODUÇÃO (Recomendado)**
```
Tipo: t3.large
vCPUs: 2
Memória: 8 GiB
Preço: ~$0.0832/hora
Rede: Até 5 Gbps
```

#### **OPÇÃO 3 - ALTA PERFORMANCE**
```
Tipo: t3.xlarge
vCPUs: 4
Memória: 16 GiB
Preço: ~$0.1664/hora
Rede: Até 5 Gbps
```

### 3️⃣ **KEY PAIR (LOGIN)**

```
Nome do Key Pair: corinthians-online-key-server
Tipo: RSA
Formato: .pem (para SSH)
```
⚠️ **IMPORTANTE**: Baixe e guarde o arquivo .pem com segurança!

### 4️⃣ **CONFIGURAÇÕES DE REDE**

#### **VPC e Subnet**
```
VPC: vpc-0c118ed8ef82ae473 (default)
Subnet: Escolha uma subnet pública
Auto-assign public IP: Enable ✅
```

#### **Security Group**
Crie um novo Security Group: `corinthians-online-sg`

**Regras de Entrada (Inbound Rules):**
| Tipo | Protocolo | Porta | Origem | Descrição |
|------|-----------|-------|--------|-----------|
| SSH | TCP | 22 | Seu IP | Acesso SSH administrativo |
| HTTP | TCP | 80 | 0.0.0.0/0 | Tráfego web público |
| HTTPS | TCP | 443 | 0.0.0.0/0 | Tráfego web seguro |
| Custom TCP | TCP | 1337 | Seu IP | Strapi Admin Panel |
| Custom TCP | TCP | 3306 | Security Group ID | MySQL interno |

### 5️⃣ **ARMAZENAMENTO**

#### **Volume Root**
```
Tipo: gp3 (SSD)
Tamanho: 30 GiB
IOPS: 3000
Throughput: 125 MiB/s
Delete on termination: No ❌
```

#### **Volume Adicional (Dados/Backup)**
```
Tipo: gp3
Tamanho: 50 GiB
Mount point: /data
Encrypted: Yes ✅
```

### 6️⃣ **CONFIGURAÇÕES AVANÇADAS**

```yaml
User Data Script:
#!/bin/bash
# Atualizar sistema
yum update -y

# Instalar Docker e Docker Compose
yum install -y docker git
systemctl start docker
systemctl enable docker
usermod -a -G docker ec2-user

# Instalar Node.js 20
curl -sL https://rpm.nodesource.com/setup_20.x | bash -
yum install -y nodejs

# Instalar PM2 globalmente
npm install -g pm2

# Instalar nginx
yum install -y nginx
systemctl start nginx
systemctl enable nginx

# Criar diretórios
mkdir -p /var/www/corinthians-online
mkdir -p /var/log/corinthians

# Configurar swap (importante para t3.medium)
dd if=/dev/zero of=/swapfile bs=128M count=32
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo "/swapfile swap swap defaults 0 0" >> /etc/fstab
```

---

## 🔧 CONFIGURAÇÃO PÓS-LANÇAMENTO

### 1️⃣ **Conectar via SSH**
```bash
chmod 400 corinthians-online-key-server.pem
ssh -i corinthians-online-key-server.pem ec2-user@[IP-PÚBLICO]
```

### 2️⃣ **Instalar MySQL**
```bash
# Usando Docker
docker run -d \
  --name mysql-corinthians \
  -e MYSQL_ROOT_PASSWORD=SuaSenhaSegura123! \
  -e MYSQL_DATABASE=corinthians_online \
  -p 3306:3306 \
  -v /data/mysql:/var/lib/mysql \
  --restart always \
  mysql:8.0
```

### 3️⃣ **Clonar e Configurar o Projeto**
```bash
cd /var/www
git clone https://github.com/ferramentas-acrd/corinthians-online.git
cd corinthians-online

# Configurar CMS
cd cms
cp .env.example .env
nano .env  # Editar configurações
npm install
npm run build

# Configurar Frontend
cd ../frontend
cp .env.example .env
nano .env  # Editar configurações
npm install
npm run build
```

### 4️⃣ **Configurar PM2**
```bash
# Criar ecosystem file
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
      max_memory_restart: '1G'
    },
    {
      name: 'astro-frontend',
      cwd: '/var/www/corinthians-online/frontend',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 4321
      },
      instances: 2,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M'
    }
  ]
};
EOF

# Iniciar aplicações
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 5️⃣ **Configurar Nginx**
```nginx
# /etc/nginx/conf.d/corinthians.conf
server {
    listen 80;
    server_name corinthiansonline.com www.corinthiansonline.com;

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

    # Strapi API
    location /api {
        proxy_pass http://localhost:1337/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Strapi Admin
    location /admin {
        proxy_pass http://localhost:1337/admin;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Media files
    location /uploads {
        proxy_pass http://localhost:1337/uploads;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        # Cache de imagens
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Compressão
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/css text/javascript text/xml text/plain application/javascript application/json application/xml;
}
```

---

## 📊 ESTIMATIVA DE CUSTOS AWS

### **Custos Mensais Estimados**

| Serviço | Configuração | Custo/Mês |
|---------|-------------|-----------|
| **EC2 t3.large** | 24/7 operation | ~$60 |
| **EBS Storage** | 80 GiB total | ~$8 |
| **Data Transfer** | 100 GB/mês | ~$9 |
| **Elastic IP** | 1 IP estático | Grátis* |
| **CloudWatch** | Monitoramento básico | Grátis |
| **Route 53** | DNS hosting | ~$0.50 |
| **Backup (Snapshots)** | 80 GiB | ~$4 |
| **TOTAL ESTIMADO** | | **~$82/mês** |

*Elastic IP é grátis enquanto associado a uma instância em execução

---

## 🚦 MONITORAMENTO E ALERTAS

### **CloudWatch Metrics**
Configure alertas para:
- CPU Utilization > 80%
- Memory Usage > 85%
- Disk Usage > 90%
- Network In/Out anomalias
- Application Health Checks

### **Logs**
```bash
# Configurar CloudWatch Logs
sudo yum install -y amazon-cloudwatch-agent
# Configurar para coletar logs de:
# - /var/log/nginx/
# - /var/www/corinthians-online/cms/logs/
# - PM2 logs
```

---

## 🔒 SEGURANÇA ADICIONAL

### **1. SSL/TLS com Let's Encrypt**
```bash
sudo yum install -y certbot python3-certbot-nginx
sudo certbot --nginx -d corinthiansonline.com -d www.corinthiansonline.com
```

### **2. Firewall (iptables)**
```bash
# Configurar regras básicas de firewall
sudo iptables -A INPUT -p tcp --dport 22 -s SEU_IP/32 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
sudo iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
sudo iptables -P INPUT DROP
```

### **3. Fail2ban**
```bash
sudo yum install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## 🔄 BACKUP E RECUPERAÇÃO

### **Backup Automático**
```bash
# Script de backup diário
cat > /home/ec2-user/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backup/$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR

# Backup do banco de dados
docker exec mysql-corinthians mysqldump -u root -p$MYSQL_PASSWORD corinthians_online > $BACKUP_DIR/database.sql

# Backup dos arquivos
tar -czf $BACKUP_DIR/uploads.tar.gz /var/www/corinthians-online/cms/public/uploads

# Sync para S3
aws s3 sync $BACKUP_DIR s3://corinthians-backup/$(date +%Y%m%d)/

# Limpar backups antigos (manter últimos 7 dias)
find /backup -type d -mtime +7 -exec rm -rf {} \;
EOF

chmod +x /home/ec2-user/backup.sh

# Adicionar ao crontab
(crontab -l 2>/dev/null; echo "0 2 * * * /home/ec2-user/backup.sh") | crontab -
```

---

## 🎯 OTIMIZAÇÕES DE PERFORMANCE

### **1. CloudFront CDN**
Configure CloudFront para servir assets estáticos:
- Imagens
- CSS/JS
- Fonts

### **2. ElastiCache (Redis)**
Para cache de sessões e queries:
```
Tipo: cache.t3.micro
Engine: Redis 6.2
Nodes: 1
```

### **3. RDS (Opcional)**
Migrar MySQL para RDS para melhor gestão:
```
Tipo: db.t3.small
Engine: MySQL 8.0
Storage: 20 GiB
Multi-AZ: No (início)
```

---

## 📝 CHECKLIST DE DEPLOY

- [ ] Lançar instância EC2 com configurações corretas
- [ ] Configurar Security Groups
- [ ] Instalar dependências do sistema
- [ ] Configurar MySQL/RDS
- [ ] Clonar e configurar projeto
- [ ] Configurar variáveis de ambiente
- [ ] Build das aplicações
- [ ] Configurar PM2
- [ ] Configurar Nginx
- [ ] Instalar certificado SSL
- [ ] Configurar backups
- [ ] Testar todas as funcionalidades
- [ ] Configurar monitoramento
- [ ] Documentar credenciais

---

## 🆘 TROUBLESHOOTING

### **Problema: Memória insuficiente**
```bash
# Verificar uso de memória
free -h
# Ajustar swap se necessário
```

### **Problema: Porta 1337 não acessível**
```bash
# Verificar se Strapi está rodando
pm2 status
# Verificar logs
pm2 logs strapi-cms
```

### **Problema: Site lento**
```bash
# Verificar CPU e memória
top
htop
# Verificar logs do nginx
tail -f /var/log/nginx/error.log
```

---

**Documento criado para deploy na AWS EC2**
**Última atualização**: Setembro 2025
**Suporte**: devops@corinthiansonline.com