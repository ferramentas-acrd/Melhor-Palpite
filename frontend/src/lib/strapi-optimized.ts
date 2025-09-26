// Funções otimizadas do Strapi para listagens
const STRAPI_URL = (import.meta as any).env.PUBLIC_STRAPI_URL || 'http://localhost:1337';
const CONTENT_TYPE_PLURAL = (import.meta as any).env.PUBLIC_CONTENT_TYPE_PLURAL || 'noticias';

// Interface mínima para listagens
export interface PostListing {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string | null;
  createdAt: string;
  single?: boolean; // Campo para identificar posts "single"
  coverImage?: {
    url: string;
    alternativeText?: string;
    formats?: {
      thumbnail?: { url: string; width: number; height: number; };
      small?: { url: string; width: number; height: number; };
      medium?: { url: string; width: number; height: number; };
    };
  };
  category?: {
    name: string;
    slug: string;
  };
  authors?: Array<{
    name: string;
    slug?: string;
  }>;
}

// Interface completa para posts individuais (mantém a interface original)
export interface PostFull {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: any[];
  coverImage?: any;
  category?: any;
  tags?: any[];
  authors?: any[];
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  published?: string | null;
  updated?: string | null;
  seo?: any;
  single?: boolean;
}

/**
 * Busca posts otimizada para listagens (homepage, categorias, etc.)
 * Retorna apenas os campos essenciais para performance
 */
export async function getPostsOptimized(limit = 10, page = 1): Promise<PostListing[]> {
  try {
    // URL otimizada - usando o endpoint real que já está funcionando
    const url = `${STRAPI_URL}/api/${CONTENT_TYPE_PLURAL}/listagem?pagination[page]=${page}&pagination[pageSize]=${limit}`;
    
    const response = await fetch(url);

    if (!response.ok) {
      console.warn(`Optimized API failed with status ${response.status}, falling back to original API`);
      return await getPostsOptimizedFallback(limit, page);
    }

    const data = await response.json();
    const posts = data.data || [];
    
    // Mapear para a interface PostListing
    return posts.map((post: any): PostListing => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
      single: post.single,
      coverImage: post.coverImage,
      category: post.category,
      authors: post.authors || []
    }));
  } catch (error) {
    console.error('Error in getPostsOptimized:', error);
    // Fallback para API padrão
    return await getPostsOptimizedFallback(limit, page);
  }
}

/**
 * Fallback: usa a API padrão com populate seletivo
 */
async function getPostsOptimizedFallback(limit = 10, page = 1): Promise<PostListing[]> {
  try {
    // Populate apenas os campos necessários
    const populateParams = [
      'populate[coverImage][fields][0]=url',
      'populate[coverImage][fields][1]=alternativeText',
      'populate[coverImage][fields][2]=formats',
      'populate[category][fields][0]=name',
      'populate[category][fields][1]=slug',
      'populate[authors][fields][0]=name',
      'populate[authors][fields][1]=slug',
      `pagination[page]=${page}`,
      `pagination[pageSize]=${limit}`,
      'fields[0]=id',
      'fields[1]=title',
      'fields[2]=slug',
      'fields[3]=excerpt',
      'fields[4]=publishedAt',
      'fields[5]=createdAt'
    ].join('&');

    const url = `${STRAPI_URL}/api/${CONTENT_TYPE_PLURAL}?${populateParams}`;
    
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`API error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    const posts = data.data || [];

    // Filtrar posts single: true e mapear para interface otimizada
    const validPosts = posts
      .filter((post: any) => post.single !== true && post.slug && post.slug.trim() !== '')
      .map((post: any): PostListing => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        publishedAt: post.publishedAt,
        createdAt: post.createdAt,
        coverImage: post.coverImage ? {
          url: post.coverImage.url,
          alternativeText: post.coverImage.alternativeText,
          formats: post.coverImage.formats
        } : undefined,
        category: post.category ? {
          name: post.category.name,
          slug: post.category.slug
        } : undefined,
        authors: post.authors?.map((author: any) => ({
          name: author.name,
          slug: author.slug
        })) || []
      }));

    return validPosts;
  } catch (error) {
    console.error('Error in getPostsOptimizedFallback:', error);
    return [];
  }
}

/**
 * Busca posts por categoria de forma otimizada
 */
export async function getPostsByCategoryOptimized(categorySlug: string, limit = 10, page = 1): Promise<PostListing[]> {
  try {
    const url = `${STRAPI_URL}/api/${CONTENT_TYPE_PLURAL}/listagem?filters[category][slug][$eq]=${categorySlug}&pagination[page]=${page}&pagination[pageSize]=${limit}`;
    
    const response = await fetch(url);

    if (!response.ok) {
      console.warn(`Optimized category API failed with status ${response.status}, falling back to original API`);
      return await getPostsByCategoryOptimizedFallback(categorySlug, limit, page);
    }

    const data = await response.json();
    const posts = data.data || [];
    
    // Mapear para a interface PostListing
    return posts.map((post: any): PostListing => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
      single: post.single,
      coverImage: post.coverImage,
      category: post.category,
      authors: post.authors || []
    }));
  } catch (error) {
    console.error('Error in getPostsByCategoryOptimized:', error);
    return await getPostsByCategoryOptimizedFallback(categorySlug, limit, page);
  }
}

async function getPostsByCategoryOptimizedFallback(categorySlug: string, limit = 10, page = 1): Promise<PostListing[]> {
  try {
    const populateParams = [
      `filters[category][slug][$eq]=${categorySlug}`,
      'populate[coverImage][fields][0]=url',
      'populate[coverImage][fields][1]=alternativeText',
      'populate[coverImage][fields][2]=formats',
      'populate[category][fields][0]=name',
      'populate[category][fields][1]=slug',
      'populate[authors][fields][0]=name',
      'populate[authors][fields][1]=slug',
      `pagination[page]=${page}`,
      `pagination[pageSize]=${limit}`,
      'fields[0]=id',
      'fields[1]=title',
      'fields[2]=slug',
      'fields[3]=excerpt',
      'fields[4]=publishedAt',
      'fields[5]=createdAt'
    ].join('&');

    const url = `${STRAPI_URL}/api/${CONTENT_TYPE_PLURAL}?${populateParams}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`API error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    const posts = data.data || [];

    return posts
      .filter((post: any) => post.single !== true)
      .map((post: any): PostListing => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        publishedAt: post.publishedAt,
        createdAt: post.createdAt,
        coverImage: post.coverImage ? {
          url: post.coverImage.url,
          alternativeText: post.coverImage.alternativeText,
          formats: post.coverImage.formats
        } : undefined,
        category: post.category ? {
          name: post.category.name,
          slug: post.category.slug
        } : undefined,
        authors: post.authors?.map((author: any) => ({
          name: author.name,
          slug: author.slug
        })) || []
      }));
  } catch (error) {
    console.error('Error in getPostsByCategoryOptimizedFallback:', error);
    return [];
  }
}

/**
 * Busca posts featured de forma otimizada
 */
export async function getFeaturedPostsOptimized(limit = 3): Promise<PostListing[]> {
  try {
    const url = `${STRAPI_URL}/api/${CONTENT_TYPE_PLURAL}/listagem?filters[coverImage][$notNull]=true&pagination[pageSize]=${limit}`;
    
    const response = await fetch(url);

    if (!response.ok) {
      return await getFeaturedPostsOptimizedFallback(limit);
    }

    const data = await response.json();
    return (data.data || []).filter((post: PostListing) => post.single !== true);
  } catch (error) {
    console.error('Error in getFeaturedPostsOptimized:', error);
    return await getFeaturedPostsOptimizedFallback(limit);
  }
}

async function getFeaturedPostsOptimizedFallback(limit = 3): Promise<PostListing[]> {
  try {
    const populateParams = [
      'filters[coverImage][$notNull]=true',
      'populate[coverImage][fields][0]=url',
      'populate[coverImage][fields][1]=alternativeText',
      'populate[coverImage][fields][2]=formats',
      'populate[category][fields][0]=name',
      'populate[category][fields][1]=slug',
      'populate[authors][fields][0]=name',
      'populate[authors][fields][1]=slug',
      `pagination[pageSize]=${limit}`,
      'fields[0]=id',
      'fields[1]=title',
      'fields[2]=slug',
      'fields[3]=excerpt',
      'fields[4]=publishedAt',
      'fields[5]=createdAt'
    ].join('&');

    const url = `${STRAPI_URL}/api/${CONTENT_TYPE_PLURAL}?${populateParams}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`API error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    const posts = data.data || [];

    return posts
      .filter((post: any) => post.single !== true && post.coverImage?.url)
      .map((post: any): PostListing => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        publishedAt: post.publishedAt,
        createdAt: post.createdAt,
        coverImage: {
          url: post.coverImage.url,
          alternativeText: post.coverImage.alternativeText,
          formats: post.coverImage.formats
        },
        category: post.category ? {
          name: post.category.name,
          slug: post.category.slug
        } : undefined,
        authors: post.authors?.map((author: any) => ({
          name: author.name,
          slug: author.slug
        })) || []
      }));
  } catch (error) {
    console.error('Error in getFeaturedPostsOptimizedFallback:', error);
    return [];
  }
}

/**
 * Função otimizada para posts da homepage (posts em destaque)
 */
export async function getHomePagePostsOptimized(limit: number = 300): Promise<PostListing[]> {
  try {
    const url = `${STRAPI_URL}/api/noticias/listagem?featured=true&limit=${limit}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data || !Array.isArray(data.data)) {
      throw new Error('Resposta inválida da API otimizada');
    }
    
    // Mapear para a interface PostListing
    const mappedPosts = data.data.map((post: any): PostListing => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
      single: post.single,
      coverImage: post.coverImage,
      category: post.category,
      authors: post.authors || []
    }));
    
    return mappedPosts;
    
  } catch (error) {
    console.error('❌ Erro no getHomePagePostsOptimized:', error);
    throw error;
  }
}

/**
 * Utilitário para converter PostListing em formato compatível com componentes existentes
 */
export function convertToLegacyFormat(post: PostListing): any {
  return {
    ...post,
    // Adicionar campos que podem ser esperados pelos componentes
    documentId: post.id.toString(),
    content: undefined, // Não disponível em listagens
    tags: [], // Não incluído em listagens para performance
    updatedAt: post.createdAt, // Fallback
    published: post.publishedAt,
    updated: post.createdAt,
    seo: undefined // Não necessário em listagens
  };
}

/**
 * Busca posts relacionados por categoria de forma otimizada
 */
export async function getRelatedPostsByCategoryOptimized(categoryId: string, excludePostId: string, limit = 4): Promise<PostListing[]> {
  try {
    const url = `${STRAPI_URL}/api/${CONTENT_TYPE_PLURAL}/listagem?filters[category][id][$eq]=${categoryId}&filters[id][$ne]=${excludePostId}&pagination[pageSize]=${limit}&sort=publishedAt:desc`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data || !Array.isArray(data.data)) {
      throw new Error('Resposta inválida da API otimizada');
    }
    
    // Mapear e filtrar posts single
    const mappedPosts = data.data
      .filter((post: any) => post.single !== true)
      .map((post: any): PostListing => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        publishedAt: post.publishedAt,
        createdAt: post.createdAt,
        single: post.single,
        coverImage: post.coverImage,
        category: post.category,
        authors: post.authors || []
      }))
      .slice(0, limit);
    
    return mappedPosts;
    
  } catch (error) {
    console.error('❌ Erro no getRelatedPostsByCategoryOptimized:', error);
    throw error;
  }
}

/**
 * Busca posts adjacentes (anterior e próximo) de forma otimizada
 */
export async function getAdjacentPostsOptimized(currentPostDate: string, currentPostId: string): Promise<{ prevPost: PostListing | null; nextPost: PostListing | null }> {
  try {
    const prevUrl = `${STRAPI_URL}/api/${CONTENT_TYPE_PLURAL}/listagem?filters[publishedAt][$gt]=${currentPostDate}&filters[id][$ne]=${currentPostId}&sort=publishedAt:asc&pagination[pageSize]=10`;
    const nextUrl = `${STRAPI_URL}/api/${CONTENT_TYPE_PLURAL}/listagem?filters[publishedAt][$lt]=${currentPostDate}&filters[id][$ne]=${currentPostId}&sort=publishedAt:desc&pagination[pageSize]=10`;
    
    const [prevResponse, nextResponse] = await Promise.all([
      fetch(prevUrl),
      fetch(nextUrl)
    ]);

    const prevData = prevResponse.ok ? await prevResponse.json() : { data: [] };
    const nextData = nextResponse.ok ? await nextResponse.json() : { data: [] };

    // Filtrar posts single e mapear
    const prevPosts = (prevData.data || [])
      .filter((post: any) => post.single !== true)
      .map((post: any): PostListing => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        publishedAt: post.publishedAt,
        createdAt: post.createdAt,
        single: post.single,
        coverImage: post.coverImage,
        category: post.category,
        authors: post.authors || []
      }));

    const nextPosts = (nextData.data || [])
      .filter((post: any) => post.single !== true)
      .map((post: any): PostListing => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        publishedAt: post.publishedAt,
        createdAt: post.createdAt,
        single: post.single,
        coverImage: post.coverImage,
        category: post.category,
        authors: post.authors || []
      }));

    const result = {
      prevPost: prevPosts[0] || null,
      nextPost: nextPosts[0] || null
    };
    
    return result;
    
  } catch (error) {
    console.error('❌ Erro no getAdjacentPostsOptimized:', error);
    return { prevPost: null, nextPost: null };
  }
}

