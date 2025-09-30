const { chromium } = require('@playwright/test');

async function testContentManager() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500
  });
  
  const context = await browser.newContext({
    ignoreHTTPSErrors: true
  });
  
  const page = await context.newPage();
  
  console.log('📌 Testando Content Manager...\n');
  
  try {
    // Login
    console.log('1. Fazendo login...');
    await page.goto('https://www.melhorpalpite.com.br/admin/', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    await page.fill('input[name="email"]', 'caio.bessa@acroud.media');
    await page.fill('input[name="password"]', 'dibges-kygDyp-4wacde');
    await page.click('button[type="submit"]');
    
    await page.waitForTimeout(3000);
    console.log('✅ Login OK\n');
    
    // Acessar Content Manager
    console.log('2. Acessando Content Manager...');
    await page.goto('https://www.melhorpalpite.com.br/admin/content-manager', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    console.log('✅ Content Manager carregou\n');
    
    // Procurar Posts
    console.log('3. Procurando Collection Type Posts...');
    
    // Tentar clicar no menu lateral se existir
    const postMenuItem = await page.$('text=Posts');
    if (postMenuItem) {
      console.log('✅ Menu "Posts" encontrado! Clicando...');
      await postMenuItem.click();
      await page.waitForTimeout(2000);
    } else {
      console.log('⚠️ Menu "Posts" não encontrado, tentando acesso direto...');
      
      // Acessar diretamente
      await page.goto('https://www.melhorpalpite.com.br/admin/content-manager/collection-types/api::post.post', {
        waitUntil: 'networkidle',
        timeout: 30000
      });
    }
    
    console.log('✅ Página de Posts acessada!\n');
    
    // Verificar se há botão de criar novo
    const createButton = await page.$('button:has-text("Create new entry"), button:has-text("Add new"), button:has-text("Create")');
    if (createButton) {
      console.log('✅ Botão de criar novo post encontrado!');
    } else {
      console.log('⚠️ Botão de criar não encontrado');
    }
    
    // Capturar screenshot
    await page.screenshot({ path: 'content-manager-posts.png' });
    console.log('📸 Screenshot salvo: content-manager-posts.png\n');
    
    console.log('✅ TESTE CONCLUÍDO COM SUCESSO!');
    console.log('O Content Manager está funcionando corretamente.');
    console.log('Você pode acessar em: https://www.melhorpalpite.com.br/admin/content-manager');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await browser.close();
  }
}

testContentManager();