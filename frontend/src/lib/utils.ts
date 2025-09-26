export function truncateText(text: string, maxLength: number = 100): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim();
}

// Função para converter HTML entities em texto normal
export function decodeHtmlEntities(text: string): string {
  if (!text) return '';
  
  // Converter entidades HTML comuns
  return text
    .replace(/&hellip;/g, '...')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–');
}

// Função para garantir que URLs internas tenham barra final
export function ensureTrailingSlash(url: string): string {
  if (!url) return '/';
  
  // URLs externas (com protocolo) não devem ser modificadas
  if (url.includes('://')) return url;
  
  // URLs que já terminam com / não precisam ser modificadas
  if (url.endsWith('/')) return url;
  
  // URLs com parâmetros ou âncoras não devem ter / adicionada
  if (url.includes('?') || url.includes('#')) return url;
  
  // URLs de arquivos (com extensão) não devem ter / adicionada
  const lastSegment = url.split('/').pop() || '';
  if (lastSegment.includes('.')) return url;
  
  // Adicionar barra final para URLs internas
  return url + '/';
}

// Função para verificar e redirecionar URLs sem trailing slash
export function checkTrailingSlashRedirect(astroInstance: any): Response | null {
  const currentUrl = astroInstance.url.pathname;
  
  // Não redirecionar se:
  // 1. Já termina com /
  // 2. É um arquivo (tem extensão)
  // 3. Tem parâmetros de query ou âncora
  if (
    currentUrl.endsWith('/') ||
    currentUrl.includes('.') ||
    astroInstance.url.search ||
    astroInstance.url.hash
  ) {
    return null;
  }
  
  // URL especiais que não devem ter trailing slash
  const excludePaths = ['/api', '/rss', '/sitemap.xml', '/robots.txt'];
  if (excludePaths.some(path => currentUrl.startsWith(path))) {
    return null;
  }
  
  // Redirecionar para versão com trailing slash (301 permanente)
  return astroInstance.redirect(currentUrl + '/', 301);
}