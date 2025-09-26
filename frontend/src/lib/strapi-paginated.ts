import type { Post, Tag } from './strapi';

const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL || 'http://localhost:1337';
const CONTENT_TYPE_PLURAL = import.meta.env.PUBLIC_CONTENT_TYPE_PLURAL || 'posts';

 // Função para buscar posts relacionados por categoria
export async function getRelatedPostsByCategory(categoryId: string, excludePostId: string, limit: number = 4): Promise<Post[]> {
  try {
    // Buscar apenas os campos essenciais para posts relacionados (com populate para trazer campos necessários)
    const url = `${STRAPI_URL}/api/${CONTENT_TYPE_PLURAL}?filters[category][id][$eq]=${categoryId}&filters[id][$ne]=${excludePostId}&pagination[pageSize]=${limit * 2}&sort=publishedAt:desc&populate[coverImage][fields][0]=url&populate[coverImage][fields][1]=alternativeText&populate[coverImage][fields][2]=formats&populate[category][fields][0]=name&populate[category][fields][1]=slug&populate[authors][fields][0]=name&populate[authors][fields][1]=slug`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error(`API error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    const posts = data.data || [];
    
    // Filtrar posts com single: true no JavaScript (mais confiável)
    const filteredPosts = posts.filter((post: any) => post.single !== true);
    
    return filteredPosts.slice(0, limit);
  } catch (error) {
    console.error('Error in getRelatedPostsByCategory:', error);
    return [];
  }
}

 // Função para buscar post anterior e próximo
export async function getAdjacentPosts(currentPostDate: string, currentPostId: string): Promise<{ prevPost: Post | null, nextPost: Post | null }> {
  try {
    // Buscar post anterior (mais recente que o atual) com campos mínimos
    const prevUrl = `${STRAPI_URL}/api/${CONTENT_TYPE_PLURAL}?filters[publishedAt][$gt]=${currentPostDate}&filters[id][$ne]=${currentPostId}&sort=publishedAt:asc&pagination[pageSize]=10&fields[0]=title&fields[1]=slug&fields[2]=single`;

    // Buscar próximo post (mais antigo que o atual) com campos mínimos
    const nextUrl = `${STRAPI_URL}/api/${CONTENT_TYPE_PLURAL}?filters[publishedAt][$lt]=${currentPostDate}&filters[id][$ne]=${currentPostId}&sort=publishedAt:desc&pagination[pageSize]=10&fields[0]=title&fields[1]=slug&fields[2]=single`;

    const [prevResponse, nextResponse] = await Promise.all([
      fetch(prevUrl),
      fetch(nextUrl)
    ]);

    const prevData = prevResponse.ok ? await prevResponse.json() : { data: [] };
    const nextData = nextResponse.ok ? await nextResponse.json() : { data: [] };

    // Filtrar posts com single: true no JavaScript
    const prevPosts = (prevData.data || []).filter((post: any) => post.single !== true);
    const nextPosts = (nextData.data || []).filter((post: any) => post.single !== true);

    return {
      prevPost: prevPosts[0] || null,
      nextPost: nextPosts[0] || null
    };
  } catch (error) {
    console.error('Error in getAdjacentPosts:', error);
    return { prevPost: null, nextPost: null };
  }
}

// Função para buscar TODOS os posts com paginação
export async function getAllPostsPaginated(): Promise<Post[]> {
  try {
    const allPosts: Post[] = [];
    let page = 1;
    const pageSize = 100; // Buscar 100 posts por vez
    let hasMore = true;

    while (hasMore) {
      // URL com paginação e populate específico
      const url = `${STRAPI_URL}/api/${CONTENT_TYPE_PLURAL}?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate[coverImage][fields][0]=url&populate[coverImage][fields][1]=alternativeText&populate[coverImage][fields][2]=formats&populate[category][fields][0]=name&populate[category][fields][1]=slug&populate[authors][populate][avatar]=true&populate[authors][fields][0]=name&populate[authors][fields][1]=bio&populate[authors][fields][2]=slug&populate[tags][fields][0]=name&populate[tags][fields][1]=slug&populate[seo][populate]=*`;

      console.log(`Fetching posts page ${page}...`);
      const response = await fetch(url);

      if (!response.ok) {
        console.error(`API error: ${response.status}`);
        break;
      }

      const data = await response.json();
      const posts = data.data || [];
      const pagination = data.meta?.pagination;

      // Filtrar posts sem slug ou com slug vazio E posts com single: true
      const validPosts = posts.filter((post: any) => 
        post.slug && 
        post.slug.trim() !== '' && 
        post.single !== true
      );

      // Log posts com problema
      const invalidPosts = posts.filter((post: any) => !post.slug || post.slug.trim() === '');
      if (invalidPosts.length > 0) {
        console.warn(`Found ${invalidPosts.length} posts without valid slug on page ${page}`);
        invalidPosts.forEach((post: any) => {
          console.warn(`- Post ID ${post.id}: "${post.title}" has slug: "${post.slug}"`);
        });
      }

      // Log posts single filtrados
      const singlePosts = posts.filter((post: any) => post.single === true);
      if (singlePosts.length > 0) {
        console.log(`Filtered ${singlePosts.length} single posts on page ${page}`);
      }

      allPosts.push(...validPosts);

      // Verificar se há mais páginas
      if (pagination) {
        hasMore = page < pagination.pageCount;
        page++;
      } else {
        hasMore = false;
      }

      console.log(`Fetched ${validPosts.length} valid posts. Total so far: ${allPosts.length}`);
    }

    console.log(`Total posts fetched: ${allPosts.length}`);
    return allPosts;
  } catch (error) {
    console.error('Error in getAllPostsPaginated:', error);
    return [];
  }
}

// Função para buscar posts por categoria com paginação
export async function getPostsByCategoryPaginated(categorySlug: string, page: number = 1, pageSize: number = 12): Promise<{ data: Post[], meta: any }> {
  try {
    // Buscar diretamente da API com filtro de categoria
    const url = `${STRAPI_URL}/api/${CONTENT_TYPE_PLURAL}?filters[category][slug][$eq]=${categorySlug}&pagination[page]=${page}&pagination[pageSize]=${pageSize * 2}&populate[coverImage][fields][0]=url&populate[coverImage][fields][1]=alternativeText&populate[coverImage][fields][2]=formats&populate[category][fields][0]=name&populate[category][fields][1]=slug&populate[authors][populate][avatar]=true&populate[authors][fields][0]=name&populate[authors][fields][1]=bio&populate[authors][fields][2]=slug&populate[tags][fields][0]=name&populate[tags][fields][1]=slug&populate[seo][populate]=*`;

    console.log(`Fetching posts for category ${categorySlug}, page ${page}...`);
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`API error: ${response.status}`);
      return { data: [], meta: { pagination: { total: 0, page: 1, pageSize, pageCount: 0 } } };
    }

    const result = await response.json();
    const posts = result.data || [];

    // Filtrar posts sem slug, com slug vazio E posts com single: true
    const validPosts = posts.filter((post: any) => 
      post.slug && 
      post.slug.trim() !== '' && 
      post.single !== true
    ).slice(0, pageSize);

    return {
      data: validPosts,
      meta: result.meta || { pagination: { total: validPosts.length, page: 1, pageSize, pageCount: 1 } }
    };
  } catch (error) {
    console.error('Error in getPostsByCategoryPaginated:', error);
    return { data: [], meta: { pagination: { total: 0, page: 1, pageSize, pageCount: 0 } } };
  }
}

// Função auxiliar para buscar TODOS os posts de uma categoria
export async function getAllPostsByCategory(categorySlug: string): Promise<Post[]> {
  try {
    const allPosts: Post[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const { data, meta } = await getPostsByCategoryPaginated(categorySlug, page, 100);
      allPosts.push(...data);

      if (meta?.pagination) {
        hasMore = page < meta.pagination.pageCount;
        page++;
      } else {
        hasMore = false;
      }
    }

    return allPosts;
  } catch (error) {
    console.error('Error in getAllPostsByCategory:', error);
    return [];
  }
}

// Função para buscar posts por tag com paginação
export async function getPostsByTagPaginated(tagSlug: string, page: number = 1, pageSize: number = 12): Promise<{ data: Post[], meta: any }> {
  try {
    // Buscar diretamente da API com filtro de tag
    const url = `${STRAPI_URL}/api/${CONTENT_TYPE_PLURAL}?filters[tags][slug][$eq]=${tagSlug}&pagination[page]=${page}&pagination[pageSize]=${pageSize * 2}&populate[coverImage][fields][0]=url&populate[coverImage][fields][1]=alternativeText&populate[coverImage][fields][2]=formats&populate[category][fields][0]=name&populate[category][fields][1]=slug&populate[authors][populate][avatar]=true&populate[authors][fields][0]=name&populate[authors][fields][1]=bio&populate[authors][fields][2]=slug&populate[tags][fields][0]=name&populate[tags][fields][1]=slug&populate[seo][populate]=*`;

    console.log(`Fetching posts for tag ${tagSlug}, page ${page}...`);
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`API error: ${response.status}`);
      return { data: [], meta: { pagination: { total: 0, page: 1, pageSize, pageCount: 0 } } };
    }

    const result = await response.json();
    const posts = result.data || [];

    // Filtrar posts sem slug, com slug vazio E posts com single: true
    const validPosts = posts.filter((post: any) => 
      post.slug && 
      post.slug.trim() !== '' && 
      post.single !== true
    ).slice(0, pageSize);

    return {
      data: validPosts,
      meta: result.meta || { pagination: { total: validPosts.length, page: 1, pageSize, pageCount: 1 } }
    };
  } catch (error) {
    console.error('Error in getPostsByTagPaginated:', error);
    return { data: [], meta: { pagination: { total: 0, page: 1, pageSize, pageCount: 0 } } };
  }
}

// Função para buscar TODOS os posts de uma tag
export async function getAllPostsByTag(tagSlug: string): Promise<Post[]> {
  try {
    const allPosts: Post[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const { data, meta } = await getPostsByTagPaginated(tagSlug, page, 100);
      allPosts.push(...data);

      if (meta?.pagination) {
        hasMore = page < meta.pagination.pageCount;
        page++;
      } else {
        hasMore = false;
      }
    }

    return allPosts;
  } catch (error) {
    console.error('Error in getAllPostsByTag:', error);
    return [];
  }
}

// Função para buscar posts por autor com paginação
export async function getPostsByAuthorPaginated(authorSlug: string, page: number = 1, pageSize: number = 12): Promise<{ data: Post[], meta: any }> {
  try {
    const url = `${STRAPI_URL}/api/${CONTENT_TYPE_PLURAL}?` +
      `filters[authors][slug][$eq]=${authorSlug}&` +
      `pagination[page]=${page}&` +
      `pagination[pageSize]=${pageSize * 2}&` +
      `populate[coverImage][fields][0]=url&` +
      `populate[coverImage][fields][1]=alternativeText&` +
      `populate[coverImage][fields][2]=formats&` +
      `populate[category][fields][0]=name&` +
      `populate[category][fields][1]=slug&` +
      `populate[authors][populate][avatar]=true&` +
      `populate[authors][fields][0]=name&` +
      `populate[authors][fields][1]=bio&` +
      `populate[authors][fields][2]=slug&` +
      `populate[tags][fields][0]=name&` +
      `populate[tags][fields][1]=slug&` +
      `sort=publishedAt:desc`;

    console.log(`Fetching posts by author ${authorSlug} - page ${page}...`);
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`API error: ${response.status}`);
      return { data: [], meta: { pagination: { total: 0 } } };
    }

    const result = await response.json();
    const posts = result.data || [];
    
    // Filtrar posts com single: true no JavaScript
    const validPosts = posts.filter((post: any) => post.single !== true).slice(0, pageSize);

    return {
      data: validPosts,
      meta: result.meta || { pagination: { total: validPosts.length } }
    };
  } catch (error) {
    console.error('Error in getPostsByAuthorPaginated:', error);
    return { data: [], meta: { pagination: { total: 0 } } };
  }
}

// Função auxiliar para buscar TODOS os posts de um autor
export async function getAllPostsByAuthor(authorSlug: string): Promise<Post[]> {
  try {
    const allPosts: Post[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const { data, meta } = await getPostsByAuthorPaginated(authorSlug, page, 100);
      allPosts.push(...data);

      if (meta?.pagination) {
        hasMore = page < meta.pagination.pageCount;
        page++;
      } else {
        hasMore = false;
      }
    }

    return allPosts;
  } catch (error) {
    console.error('Error in getAllPostsByAuthor:', error);
    return [];
  }
}