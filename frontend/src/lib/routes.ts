// Helper para gerar rotas consistentes
const routePrefix = (import.meta as any).env.PUBLIC_ROUTE_PREFIX || (import.meta as any).env.PUBLIC_CONTENT_TYPE_PLURAL || 'posts';

export function getPostUrl(slug: string): string {
  return `/${routePrefix}/${slug}/`;
}

export function getCategoryUrl(slug: string): string {
  return `/categoria/${slug}/`;
}

export function getTagUrl(slug: string): string {
  return `/tag/${slug}/`;
}

export function getAuthorUrl(name: string): string {
  return `/autor/${name.toLowerCase().replace(/\s+/g, '-')}/`;
}

export function getAllPostsUrl(): string {
  return `/${routePrefix}/`;
}

export function getRoutePrefix(): string {
  return routePrefix;
}

// =====================================================================
// FUNÇÕES ESPECÍFICAS PARA APOSTAS
// =====================================================================

export function getApostasPostUrl(slug: string): string {
  return `/apostas/${slug}/`;
}

export function getApostasCategoryUrl(slug: string): string {
  return `/apostas/categoria/${slug}/`;
}

export function getApostasTagUrl(slug: string): string {
  return `/apostas/tag/${slug}/`;
}

export function getApostasAuthorUrl(name: string): string {
  return `/apostas/autor/${name.toLowerCase().replace(/\s+/g, '-')}/`;
}

export function getAllApostasUrl(): string {
  return `/apostas/`;
}

/**
 * Gera URL do autor baseado no contexto atual
 */
export function getContextualAuthorUrl(slug: string, currentPath?: string): string {
  // Verificar se estamos na seção de apostas
  if (currentPath && currentPath.includes('/apostas/')) {
    return getApostasAuthorUrl(slug);
  }
  return getAuthorUrl(slug);
}

/**
 * Gera URL da categoria baseado no contexto atual
 */
export function getContextualCategoryUrl(slug: string, currentPath?: string): string {
  // Verificar se estamos na seção de apostas
  if (currentPath && currentPath.includes('/apostas/')) {
    return getApostasCategoryUrl(slug);
  }
  return getCategoryUrl(slug);
}

/**
 * Gera URL da tag baseado no contexto atual
 */
export function getContextualTagUrl(slug: string, currentPath?: string): string {
  // Verificar se estamos na seção de apostas
  if (currentPath && currentPath.includes('/apostas/')) {
    return getApostasTagUrl(slug);
  }
  return getTagUrl(slug);
}