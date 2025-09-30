const { chromium } = require('@playwright/test');

async function deepAuditCMS() {
  const browser = await chromium.launch({ 
    headless: false, // Modo visual para debug
    slowMo: 100 // Pequeno delay para visualizar
  });
  
  const context = await browser.newContext({
    ignoreHTTPSErrors: true
  });
  
  const page = await context.newPage();
  
  console.log('🔍 AUDITORIA PROFUNDA DO CMS STRAPI\n');
  console.log('========================================\n');
  
  const errors = [];
  const successPages = [];
  
  // Capturar erros
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (!text.includes('cloudflareinsights')) { // Ignorar erros do Cloudflare
        console.log(`❌ Console Error: ${text}`);
        errors.push(`Console: ${text}`);
      }
    }
  });
  
  page.on('response', response => {
    if (response.status() >= 400) {
      const url = response.url();
      if (!url.includes('cloudflareinsights')) {
        console.log(`❌ HTTP ${response.status()}: ${url}`);
        errors.push(`HTTP ${response.status()}: ${url}`);
      }
    }
  });

  page.on('pageerror', error => {
    console.log(`❌ Page Error: ${error.message}`);
    errors.push(`Page Error: ${error.message}`);
  });

  try {
    // 1. Login
    console.log('📌 1. Fazendo login...\n');
    await page.goto('https://www.melhorpalpite.com.br/admin/', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    await page.fill('input[name="email"]', 'caio.bessa@acroud.media');
    await page.fill('input[name="password"]', 'dibges-kygDyp-4wacde');
    await page.click('button[type="submit"]');
    
    await page.waitForTimeout(5000);
    console.log('✅ Login realizado com sucesso\n');
    
    // 2. Testar Content Manager diretamente
    console.log('📌 2. Testando Content Manager...\n');
    
    try {
      console.log('Navegando para: https://www.melhorpalpite.com.br/admin/content-manager');
      const response = await page.goto('https://www.melhorpalpite.com.br/admin/content-manager', {
        waitUntil: 'networkidle',
        timeout: 30000
      });
      
      if (response.ok()) {
        console.log('✅ Content Manager carregou com sucesso');
        await page.screenshot({ path: 'content-manager-main.png' });
        
        // Aguardar conteúdo carregar
        await page.waitForTimeout(3000);
        
        // Procurar por Collection Types
        console.log('\n📌 3. Procurando Collection Types...\n');
        
        // Tentar diferentes seletores para encontrar content types
        const selectors = [
          'a[href*="/admin/content-manager/collection-types"]',
          '[data-testid="collection-type-link"]',
          'nav a[href*="collectionType"]',
          '.content-manager-link',
          'a[href*="/admin/content-manager/collectionType"]'
        ];
        
        for (const selector of selectors) {
          const elements = await page.$$(selector);
          if (elements.length > 0) {
            console.log(`Encontrados ${elements.length} links com selector: ${selector}`);
            for (const element of elements) {
              const text = await element.textContent();
              const href = await element.getAttribute('href');
              console.log(`  - ${text}: ${href}`);
            }
            break;
          }
        }
        
        // Verificar se há o Post content type
        console.log('\n📌 4. Verificando Post Content Type...\n');
        
        const postLink = await page.$('a[href*="api::post.post"]');
        if (postLink) {
          console.log('✅ Post Content Type encontrado!');
          await postLink.click();
          await page.waitForTimeout(2000);
          await page.screenshot({ path: 'post-content-type.png' });
        } else {
          console.log('⚠️ Post Content Type não encontrado no menu');
          
          // Tentar acessar diretamente
          console.log('Tentando acessar diretamente...');
          const postUrl = 'https://www.melhorpalpite.com.br/admin/content-manager/collection-types/api::post.post';
          const postResponse = await page.goto(postUrl, {
            waitUntil: 'networkidle',
            timeout: 15000
          });
          
          if (postResponse.ok()) {
            console.log('✅ Página do Post acessada diretamente!');
            await page.screenshot({ path: 'post-direct-access.png' });
          } else {
            console.log(`❌ Erro ao acessar Post: ${postResponse.status()}`);
          }
        }
        
      } else {
        console.log(`❌ Content Manager retornou erro: ${response.status()}`);
      }
      
    } catch (error) {
      console.log(`❌ Erro ao acessar Content Manager: ${error.message}`);
      errors.push({
        page: 'Content Manager',
        error: error.message
      });
    }
    
    // 5. Listar todas as rotas do menu
    console.log('\n📌 5. Mapeando todas as rotas do menu...\n');
    
    const menuLinks = await page.$$eval('nav a[href^="/admin"]', links => 
      links.map(link => ({
        text: link.textContent.trim(),
        href: link.href
      }))
    );
    
    console.log(`Encontradas ${menuLinks.length} rotas:\n`);
    
    for (const link of menuLinks) {
      console.log(`Testing: ${link.text}`);
      console.log(`  URL: ${link.href}`);
      
      try {
        const response = await page.goto(link.href, {
          waitUntil: 'networkidle',
          timeout: 15000
        });
        
        if (response.ok()) {
          console.log(`  ✅ Status: ${response.status()}\n`);
          successPages.push(link);
        } else {
          console.log(`  ❌ Status: ${response.status()}\n`);
          errors.push({
            url: link.href,
            status: response.status()
          });
        }
        
        await page.waitForTimeout(1000);
        
      } catch (error) {
        console.log(`  ❌ Erro: ${error.message}\n`);
        errors.push({
          url: link.href,
          error: error.message
        });
      }
    }
    
    // 6. Verificar configuração do servidor
    console.log('\n📌 6. Verificando configuração...\n');
    
    // Testar API diretamente
    const apiUrls = [
      '/api/content-manager/content-types',
      '/api/content-type-builder/content-types',
      '/api/posts',
      '/content-manager/collection-types',
      '/content-manager/single-types'
    ];
    
    for (const apiPath of apiUrls) {
      const fullUrl = `https://www.melhorpalpite.com.br${apiPath}`;
      console.log(`Testando API: ${fullUrl}`);
      
      try {
        const response = await page.goto(fullUrl, {
          waitUntil: 'networkidle',
          timeout: 10000
        });
        
        console.log(`  Status: ${response.status()}`);
        if (response.ok()) {
          const content = await page.content();
          if (content.includes('<!DOCTYPE')) {
            console.log('  ⚠️ Retornou HTML ao invés de JSON\n');
          } else {
            console.log('  ✅ API respondeu corretamente\n');
          }
        } else {
          console.log('  ❌ Erro na API\n');
        }
        
      } catch (error) {
        console.log(`  ❌ Erro: ${error.message}\n`);
      }
    }
    
  } catch (error) {
    console.error('❌ Erro crítico:', error);
  } finally {
    console.log('\n========================================');
    console.log('📊 RESUMO FINAL\n');
    console.log(`✅ Páginas funcionando: ${successPages.length}`);
    console.log(`❌ Erros encontrados: ${errors.length}\n`);
    
    if (errors.length > 0) {
      console.log('Lista de erros:');
      errors.forEach((err, idx) => {
        console.log(`${idx + 1}. ${JSON.stringify(err)}`);
      });
    }
    
    console.log('\n✅ Auditoria concluída!');
    console.log('📸 Screenshots salvos no diretório atual');
    
    await browser.close();
  }
}

// Executar auditoria
deepAuditCMS();