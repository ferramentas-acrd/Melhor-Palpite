import { test, expect } from '@playwright/test';

test.describe('Corinthians Online - CMS and Frontend Tests', () => {
  
  // Test Strapi CMS
  test('should access Strapi admin panel', async ({ page }) => {
    await page.goto('http://localhost:1337/admin');
    
    // Check if the Strapi admin login page loads
    await expect(page).toHaveTitle(/Strapi Admin/);
    
    // Check if welcome message or login form is present
    const welcomeText = page.locator('text=Welcome');
    const loginForm = page.locator('form');
    
    // Either welcome text or login form should be visible
    const hasWelcome = await welcomeText.isVisible().catch(() => false);
    const hasLoginForm = await loginForm.isVisible().catch(() => false);
    
    expect(hasWelcome || hasLoginForm).toBe(true);
    
    console.log('✅ Strapi CMS is accessible at http://localhost:1337/admin');
  });

  // Test Frontend
  test('should load Corinthians Online homepage', async ({ page }) => {
    await page.goto('http://localhost:4321');
    
    // Check if the page loads successfully
    await expect(page).toHaveTitle(/Corinthians Online/);
    
    // Check for key elements from our design
    await expect(page.locator('text=Bem-vindo ao Corinthians Online')).toBeVisible();
    await expect(page.locator('text=A casa de apostas oficial da Fiel Torcida')).toBeVisible();
    
    console.log('✅ Frontend homepage loads correctly');
  });

  test('should display header with correct branding', async ({ page }) => {
    await page.goto('http://localhost:4321');
    
    // Check for SC logo
    await expect(page.locator('text=SC')).toBeVisible();
    
    // Check for Corinthians Online branding
    await expect(page.locator('text=CORINTHIANS ONLINE')).toBeVisible();
    
    // Check navigation menu
    await expect(page.locator('text=Apostas Esportivas')).toBeVisible();
    await expect(page.locator('text=Cassino')).toBeVisible();
    await expect(page.locator('text=Ao Vivo')).toBeVisible();
    await expect(page.locator('text=Promoções')).toBeVisible();
    await expect(page.locator('text=Notícias')).toBeVisible();
    
    console.log('✅ Header and navigation elements are correct');
  });

  test('should display betting houses section', async ({ page }) => {
    await page.goto('http://localhost:4321');
    
    // Check for betting houses section
    await expect(page.locator('text=Melhores Casas de Apostas Parceiras')).toBeVisible();
    
    // Check for specific betting houses
    await expect(page.locator('text=bet365')).toBeVisible();
    await expect(page.locator('text=Betano')).toBeVisible();
    await expect(page.locator('text=Sportingbet')).toBeVisible();
    
    console.log('✅ Betting houses section displays correctly');
  });

  test('should display live betting section', async ({ page }) => {
    await page.goto('http://localhost:4321');
    
    // Check for live betting section
    await expect(page.locator('text=Jogos do Corinthians - Apostas ao Vivo')).toBeVisible();
    
    // Check for game odds
    await expect(page.locator('text=Corinthians X Palmeiras')).toBeVisible();
    await expect(page.locator('text=Corinthians X Flamengo')).toBeVisible();
    
    console.log('✅ Live betting section displays correctly');
  });

  test('should display footer with correct information', async ({ page }) => {
    await page.goto('http://localhost:4321');
    
    // Check footer sections
    await expect(page.locator('text=Sobre Nós')).toBeVisible();
    await expect(page.locator('text=Links Úteis')).toBeVisible();
    await expect(page.locator('text=Jogo Responsável')).toBeVisible();
    await expect(page.locator('text=Contato')).toBeVisible();
    
    // Check copyright
    await expect(page.locator('text=© 2025 Corinthians Online')).toBeVisible();
    
    console.log('✅ Footer displays correctly');
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:4321');
    
    // Check if mobile layout works
    await expect(page.locator('text=CORINTHIANS ONLINE')).toBeVisible();
    await expect(page.locator('text=Bem-vindo ao Corinthians Online')).toBeVisible();
    
    console.log('✅ Mobile responsive design works');
  });

});