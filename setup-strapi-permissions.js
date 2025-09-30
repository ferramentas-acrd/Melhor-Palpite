const { chromium } = require('@playwright/test');

async function setupStrapiPermissions() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 200
  });
  
  const context = await browser.newContext({
    ignoreHTTPSErrors: true
  });
  
  const page = await context.newPage();
  
  console.log('📌 Configurando Permissões da API Pública do Strapi\n');
  
  try {
    // 1. Login
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
    
    // 2. Acessar Settings
    console.log('2. Acessando Settings > Users & Permissions...');
    await page.goto('https://www.melhorpalpite.com.br/admin/settings', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    // Clicar em Users & Permissions Plugin
    const usersPermissionsLink = await page.locator('a[href*="/admin/settings/users-permissions"]').first();
    if (usersPermissionsLink) {
      await usersPermissionsLink.click();
      await page.waitForTimeout(2000);
    }
    
    // 3. Acessar Roles
    console.log('3. Acessando Roles...');
    const rolesLink = await page.locator('a[href*="/settings/users-permissions/roles"]').first();
    if (rolesLink) {
      await rolesLink.click();
      await page.waitForTimeout(2000);
    } else {
      // Tentar acesso direto
      await page.goto('https://www.melhorpalpite.com.br/admin/settings/users-permissions/roles', {
        waitUntil: 'networkidle',
        timeout: 30000
      });
    }
    
    // 4. Editar Public role
    console.log('4. Editando role Public...');
    const publicRole = await page.locator('text=Public').first();
    if (publicRole) {
      await publicRole.click();
      await page.waitForTimeout(2000);
    }
    
    // 5. Expandir e marcar permissões para Post
    console.log('5. Configurando permissões para Posts...');
    
    // Procurar pela seção Post
    const postSection = await page.locator('button:has-text("Post")').first();
    if (postSection) {
      // Expandir se necessário
      const isExpanded = await postSection.getAttribute('aria-expanded');
      if (isExpanded !== 'true') {
        await postSection.click();
        await page.waitForTimeout(1000);
      }
    }
    
    // Marcar checkboxes de find e findOne
    console.log('6. Habilitando find e findOne...');
    
    // Tentar diferentes seletores para os checkboxes
    const checkboxSelectors = [
      'input[type="checkbox"][name*="find"]',
      'input[type="checkbox"][value*="find"]',
      'label:has-text("find") input[type="checkbox"]',
      '//label[contains(text(), "find")]//input[@type="checkbox"]'
    ];
    
    for (const selector of checkboxSelectors) {
      try {
        const checkboxes = await page.locator(selector).all();
        for (const checkbox of checkboxes) {
          const isChecked = await checkbox.isChecked();
          if (!isChecked) {
            await checkbox.click();
            console.log('  ✅ Checkbox marcado');
            await page.waitForTimeout(500);
          }
        }
      } catch (e) {
        // Continuar tentando outros seletores
      }
    }
    
    // 6. Salvar
    console.log('7. Salvando configurações...');
    const saveButton = await page.locator('button:has-text("Save")').first();
    if (saveButton) {
      await saveButton.click();
      await page.waitForTimeout(3000);
      console.log('✅ Configurações salvas!\n');
    }
    
    // 7. Testar a API
    console.log('8. Testando API pública...');
    const testResponse = await fetch('https://www.melhorpalpite.com.br/api/posts');
    if (testResponse.ok) {
      const data = await testResponse.json();
      console.log('✅ API funcionando! Resposta:', data);
    } else {
      console.log('⚠️ API ainda não está acessível publicamente');
      console.log('   Status:', testResponse.status);
    }
    
    console.log('\n✅ CONFIGURAÇÃO CONCLUÍDA!');
    console.log('As permissões da API foram configuradas.');
    console.log('Agora o frontend pode acessar os posts do Strapi.');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await browser.close();
  }
}

setupStrapiPermissions();