const { chromium } = require('@playwright/test');

async function auditCMS() {
  const browser = await chromium.launch({ 
    headless: true, // Executar em modo headless
    slowMo: 0 // Sem delay
  });
  
  const context = await browser.newContext({
    ignoreHTTPSErrors: true // Para ignorar erros de certificado SSL
  });
  
  const page = await context.newPage();
  
  console.log('🔍 AUDITORIA COMPLETA DO CMS STRAPI\n');
  console.log('========================================\n');
  
  const errors = [];
  const successPages = [];
  
  // Capturar erros de console
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`Console Error: ${msg.text()}`);
    }
  });
  
  // Capturar erros de rede
  page.on('response', response => {
    if (response.status() >= 400) {
      errors.push(`HTTP ${response.status()} - ${response.url()}`);
    }
  });

  try {
    // 1. Acessar página de login
    console.log('📌 1. Acessando página de login...');
    await page.goto('https://www.melhorpalpite.com.br/admin/', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Screenshot da tela de login
    await page.screenshot({ path: 'cms-login.png' });
    
    // 2. Fazer login
    console.log('📌 2. Fazendo login...');
    await page.fill('input[name="email"]', 'caio.bessa@acroud.media');
    await page.fill('input[name="password"]', 'dibges-kygDyp-4wacde');
    await page.click('button[type="submit"]');
    
    // Aguardar dashboard carregar
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'cms-dashboard.png' });
    
    // 3. Mapear todas as seções do menu
    console.log('📌 3. Mapeando menu lateral...\n');
    
    const menuItems = await page.locator('nav a[href^="/admin/"]').all();
    const menuUrls = [];
    
    for (const item of menuItems) {
      const href = await item.getAttribute('href');
      const text = await item.textContent();
      if (href && !menuUrls.some(m => m.url === href)) {
        menuUrls.push({ 
          text: text?.trim() || '', 
          url: href 
        });
      }
    }
    
    console.log(`Encontradas ${menuUrls.length} seções no menu:\n`);
    menuUrls.forEach(item => {
      console.log(`  - ${item.text}: ${item.url}`);
    });
    
    // 4. Testar cada seção
    console.log('\n📌 4. Testando cada seção...\n');
    
    for (const menuItem of menuUrls) {
      console.log(`\nTestando: ${menuItem.text} (${menuItem.url})`);
      
      try {
        const fullUrl = `https://www.melhorpalpite.com.br${menuItem.url}`;
        const response = await page.goto(fullUrl, { 
          waitUntil: 'networkidle',
          timeout: 15000 
        });
        
        if (response && response.ok()) {
          console.log(`  ✅ Carregou com sucesso`);
          successPages.push({
            name: menuItem.text,
            url: menuItem.url,
            status: response.status()
          });
          
          // Verificar se há dados
          const hasContent = await page.locator('table, .list-view').count();
          if (hasContent > 0) {
            const rowCount = await page.locator('tbody tr').count();
            console.log(`  📊 ${rowCount} registros encontrados`);
          }
          
          // Screenshot da página
          const screenshotName = menuItem.text.toLowerCase().replace(/\s+/g, '-');
          await page.screenshot({ 
            path: `cms-${screenshotName}.png`,
            fullPage: true 
          });
          
        } else {
          console.log(`  ❌ Erro ao carregar: ${response?.status()}`);
          errors.push({
            page: menuItem.text,
            url: menuItem.url,
            status: response?.status(),
            error: 'Failed to load'
          });
        }
        
      } catch (error) {
        console.log(`  ❌ Erro: ${error.message}`);
        errors.push({
          page: menuItem.text,
          url: menuItem.url,
          error: error.message
        });
      }
      
      await page.waitForTimeout(1000); // Delay entre páginas
    }
    
    // 5. Testar Content Manager
    console.log('\n📌 5. Explorando Content Manager...\n');
    
    try {
      await page.goto('https://www.melhorpalpite.com.br/admin/content-manager', {
        waitUntil: 'networkidle'
      });
      
      // Listar todos os content types
      const contentTypes = await page.locator('[data-testid="collection-type-link"], a[href*="collectionType"]').all();
      
      console.log(`Encontrados ${contentTypes.length} Content Types:\n`);
      
      for (const ct of contentTypes) {
        const text = await ct.textContent();
        const href = await ct.getAttribute('href');
        console.log(`  - ${text?.trim()}: ${href}`);
        
        // Testar cada content type
        if (href) {
          try {
            await page.goto(`https://www.melhorpalpite.com.br${href}`, {
              waitUntil: 'networkidle',
              timeout: 10000
            });
            
            const count = await page.locator('tbody tr').count();
            console.log(`    ✅ ${count} registros`);
            
          } catch (error) {
            console.log(`    ❌ Erro ao acessar: ${error.message}`);
            errors.push({
              contentType: text?.trim(),
              url: href,
              error: error.message
            });
          }
        }
      }
      
    } catch (error) {
      console.log(`❌ Erro no Content Manager: ${error.message}`);
      errors.push({
        section: 'Content Manager',
        error: error.message
      });
    }
    
    // 6. Testar Media Library
    console.log('\n📌 6. Testando Media Library...\n');
    
    try {
      await page.goto('https://www.melhorpalpite.com.br/admin/plugins/upload', {
        waitUntil: 'networkidle'
      });
      
      const mediaCount = await page.locator('[data-testid="media-card"]').count();
      console.log(`  ✅ ${mediaCount} arquivos na biblioteca`);
      
      await page.screenshot({ path: 'cms-media-library.png' });
      
    } catch (error) {
      console.log(`  ❌ Erro: ${error.message}`);
      errors.push({
        section: 'Media Library',
        error: error.message
      });
    }
    
    // 7. Testar Settings
    console.log('\n📌 7. Testando Settings...\n');
    
    const settingsPages = [
      { name: 'Roles', url: '/admin/settings/roles' },
      { name: 'Users', url: '/admin/settings/users' },
      { name: 'API Tokens', url: '/admin/settings/api-tokens' },
      { name: 'Transfer Tokens', url: '/admin/settings/transfer-tokens' },
      { name: 'Webhooks', url: '/admin/settings/webhooks' },
      { name: 'Email', url: '/admin/settings/email' }
    ];
    
    for (const setting of settingsPages) {
      try {
        await page.goto(`https://www.melhorpalpite.com.br${setting.url}`, {
          waitUntil: 'networkidle',
          timeout: 10000
        });
        console.log(`  ✅ ${setting.name} - OK`);
        
      } catch (error) {
        console.log(`  ❌ ${setting.name} - Erro: ${error.message}`);
        errors.push({
          setting: setting.name,
          url: setting.url,
          error: error.message
        });
      }
    }
    
    // 8. Relatório Final
    console.log('\n========================================');
    console.log('📊 RELATÓRIO FINAL\n');
    
    console.log(`✅ Páginas funcionando: ${successPages.length}`);
    console.log(`❌ Erros encontrados: ${errors.length}\n`);
    
    if (errors.length > 0) {
      console.log('🔴 LISTA DE ERROS:\n');
      errors.forEach((error, index) => {
        console.log(`${index + 1}. ${JSON.stringify(error, null, 2)}\n`);
      });
    }
    
    // Salvar relatório em arquivo
    const report = {
      timestamp: new Date().toISOString(),
      successCount: successPages.length,
      errorCount: errors.length,
      successPages,
      errors,
      menuUrls
    };
    
    require('fs').writeFileSync(
      'cms-audit-report.json', 
      JSON.stringify(report, null, 2)
    );
    
    console.log('📁 Relatório salvo em: cms-audit-report.json');
    console.log('📸 Screenshots salvos no diretório atual\n');
    
  } catch (error) {
    console.error('❌ Erro crítico:', error);
  } finally {
    await browser.close();
    console.log('✅ Auditoria concluída!');
  }
}

// Executar auditoria
auditCMS();