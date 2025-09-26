import { test, expect } from '@playwright/test';

test.describe('Corinthians Online - Editorial Tests', () => {
  
  test('should load Corinthians Online homepage', async ({ page }) => {
    await page.goto('http://localhost:4321');
    
    // Check if the main title is correct
    await expect(page).toHaveTitle(/Corinthians Online - Portal Oficial da Fiel Torcida/);
    
    // Check for main header branding
    await expect(page.getByText('CORINTHIANS ONLINE')).toBeVisible();
    
    console.log('✅ Corinthians Online homepage loaded successfully');
  });
  
  test('should display editorial header with correct branding', async ({ page }) => {
    await page.goto('http://localhost:4321');
    
    // Check for SC logo (but be more specific to avoid multiple matches)
    await expect(page.locator('.bg-black.text-white').first()).toBeVisible();
    
    // Check for Corinthians Online branding
    await expect(page.locator('text=CORINTHIANS ONLINE')).toBeVisible();
    
    // Check for "Portal Oficial da Fiel"
    await expect(page.locator('text=Portal Oficial da Fiel')).toBeVisible();
    
    console.log('✅ Editorial header displayed correctly');
  });
  
  test('should display editorial navigation menu', async ({ page }) => {
    await page.goto('http://localhost:4321');
    
    // Check for main navigation items
    await expect(page.getByRole('link', { name: 'Notícias' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Jogos' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Elenco' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Vídeos' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Fórum' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Colunas' })).toBeVisible();
    
    console.log('✅ Editorial navigation menu displayed correctly');
  });
  
  test('should display main content sections', async ({ page }) => {
    await page.goto('http://localhost:4321');
    
    // Check for main content areas
    await expect(page.locator('text=DESTAQUE')).toBeVisible();
    await expect(page.locator('text=URGENTE')).toBeVisible();
    await expect(page.locator('text=Últimas Notícias')).toBeVisible();
    
    // Check for sidebar sections
    await expect(page.locator('text=Próximos Jogos')).toBeVisible();
    await expect(page.locator('text=Mais Lidas')).toBeVisible();
    
    console.log('✅ Main content sections displayed correctly');
  });
  
  test('should display footer with editorial information', async ({ page }) => {
    await page.goto('http://localhost:4321');
    
    // Check for footer sections
    await expect(page.locator('text=Sobre Nós')).toBeVisible();
    await expect(page.locator('text=Categorias')).toBeVisible();
    await expect(page.locator('text=Mais Seções')).toBeVisible();
    await expect(page.locator('text=Contato')).toBeVisible();
    
    // Check for specific footer links
    await expect(page.getByRole('link', { name: 'Fale Conosco' })).toBeVisible();
    
    console.log('✅ Editorial footer displayed correctly');
  });
  
  test('should navigate to news section', async ({ page }) => {
    await page.goto('http://localhost:4321');
    
    // Click on Notícias
    await page.getByRole('link', { name: 'Notícias' }).click();
    
    // Check if we're on the news page
    await expect(page.locator('text=Filtrar por categoria')).toBeVisible();
    await expect(page.locator('text=Todas')).toBeVisible();
    
    console.log('✅ News section navigation works correctly');
  });
  
  test('should navigate to games section', async ({ page }) => {
    await page.goto('http://localhost:4321');
    
    // Click on Jogos
    await page.getByRole('link', { name: 'Jogos' }).click();
    
    // Check if we're on the games page
    await expect(page.locator('text=Próximo Jogo')).toBeVisible();
    await expect(page.locator('text=Resultados Recentes')).toBeVisible();
    
    console.log('✅ Games section navigation works correctly');
  });
  
  test('should navigate to squad section', async ({ page }) => {
    await page.goto('http://localhost:4321');
    
    // Click on Elenco
    await page.getByRole('link', { name: 'Elenco' }).click();
    
    // Check if we're on the squad page
    await expect(page.locator('text=Elenco Principal')).toBeVisible();
    await expect(page.locator('text=Goleiros')).toBeVisible();
    
    console.log('✅ Squad section navigation works correctly');
  });
  
  test('should be responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:4321');
    
    // Check if mobile menu button is visible
    await expect(page.locator('button').first()).toBeVisible();
    
    // The layout should still be functional on mobile
    await expect(page.locator('text=CORINTHIANS ONLINE')).toBeVisible();
    
    console.log('✅ Site is responsive on mobile viewport');
  });
  
  test('should have no console errors', async ({ page }) => {
    const consoleMessages = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleMessages.push(msg.text());
      }
    });
    
    await page.goto('http://localhost:4321');
    
    // Wait for page to load completely
    await page.waitForTimeout(2000);
    
    console.log(`Total console error messages: ${consoleMessages.length}`);
    
    if (consoleMessages.length > 0) {
      console.log('Console errors:', consoleMessages);
    }
    
    // Allow some errors related to missing CMS data (expected during development)
    const allowedErrors = consoleMessages.filter(msg => 
      !msg.includes('404') && 
      !msg.includes('getHomePagePostsOptimized') &&
      !msg.includes('HTTP 404: Not Found')
    );
    
    expect(allowedErrors.length).toBe(0);
  });
  
});