// Função de busca para posts
const STRAPI_URL = (import.meta as any).env.PUBLIC_STRAPI_URL || 'http://localhost:1337';
const CONTENT_TYPE_PLURAL = (import.meta as any).env.PUBLIC_CONTENT_TYPE_PLURAL || 'noticias';

export interface SearchResult {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: any;
  category?: any;
  authors?: Array<{
    name: string;
    slug?: string;
  }>;
  publishedAt: string;
}

export async function searchPosts(query: string, limit: number = 10): Promise<SearchResult[]> {
  // Tentar usar a nova rota otimizada primeiro
  try {
    const optimizedResult = await searchPostsOptimized(query, 1, limit);
    return optimizedResult.results;
  } catch (error) {
    console.log('Fallback to original search method');
  }

  // Fallback para o método original
  if (!query || query.trim().length < 3) {
    return [];
  }

  try {
    const searchQuery = encodeURIComponent(query.trim());
    
    // URL com busca em título, excerpt e nome do autor (método original)
    const url = `${STRAPI_URL}/api/${CONTENT_TYPE_PLURAL}?` +
      `filters[$or][0][title][$containsi]=${searchQuery}&` +
      `filters[$or][1][excerpt][$containsi]=${searchQuery}&` +
      `filters[$or][2][authors][name][$containsi]=${searchQuery}&` +
      `pagination[limit]=${limit}&` +
      `populate[coverImage][fields][0]=url&` +
      `populate[coverImage][fields][1]=alternativeText&` +
      `populate[coverImage][fields][2]=formats&` +
      `populate[category][fields][0]=name&` +
      `populate[category][fields][1]=slug&` +
      `populate[authors][fields][0]=name&` +
      `populate[authors][fields][1]=slug&` +
      `sort[0]=publishedAt:desc&` +
      `sort[1]=createdAt:desc`;

    console.log('Fallback Search URL:', url);

    const response = await fetch(url);

    if (!response.ok) {
      console.error('Search API error:', response.status);
      return [];
    }

    const data = await response.json();

    // Mapear os resultados com dados otimizados
    return (data.data || []).map((post: any) => {
      const postData = post.attributes || post;
      
      return {
        id: post.id,
        title: postData.title,
        slug: postData.slug,
        excerpt: postData.excerpt,
        coverImage: postData.coverImage,
        category: postData.category?.data ? {
          name: postData.category.data.attributes?.name || postData.category.data.name,
          slug: postData.category.data.attributes?.slug || postData.category.data.slug
        } : postData.category,
        authors: postData.authors?.data ? 
          postData.authors.data.map((author: any) => ({
            name: author.attributes?.name || author.name,
            slug: author.attributes?.slug || author.slug
          })) : postData.authors,
        publishedAt: postData.publishedAt || postData.createdAt
      };
    });
  } catch (error) {
    console.error('Error searching posts:', error);
    return [];
  }
}

// Função de busca otimizada usando a rota personalizada do Strapi
export async function searchPostsOptimized(query: string, page: number = 1, pageSize: number = 10): Promise<{
  results: SearchResult[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    pageCount: number;
  };
}> {
  // Validação: mínimo 3 caracteres
  if (!query || query.trim().length < 3) {
    return {
      results: [],
      pagination: { page: 1, pageSize, total: 0, pageCount: 0 }
    };
  }

  try {
    const searchQuery = encodeURIComponent(query.trim());
    
    // Usar a nova rota otimizada do Strapi
    const url = `${STRAPI_URL}/api/${CONTENT_TYPE_PLURAL}/busca?` +
      `q=${searchQuery}&` +
      `pagination[page]=${page}&` +
      `pagination[pageSize]=${pageSize}`;

    console.log('Optimized Search URL:', url);

    const response = await fetch(url);

    if (!response.ok) {
      console.error('Optimized Search API error:', response.status);
      return {
        results: [],
        pagination: { page: 1, pageSize, total: 0, pageCount: 0 }
      };
    }

    const data = await response.json();
    console.log('Optimized search API response:', data);
    console.log('Optimized search results count:', data.data?.length || 0);

    // Mapear os resultados da nova API
    const results = (data.data || []).map((post: any) => {
      console.log('Processing post:', post);
      return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || '',
        coverImage: post.coverImage || null,
        category: post.category ? {
          id: post.category.id,
          name: post.category.name,
          slug: post.category.slug
        } : null,
        authors: Array.isArray(post.authors) ? post.authors : [],
        publishedAt: post.publishedAt || post.createdAt || new Date().toISOString()
      };
    });

    return {
      results,
      pagination: data.meta?.pagination || { page: 1, pageSize, total: 0, pageCount: 0 }
    };
  } catch (error) {
    console.error('Error in optimized search:', error);
    return {
      results: [],
      pagination: { page: 1, pageSize, total: 0, pageCount: 0 }
    };
  }
}