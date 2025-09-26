// Configurações do Strapi
const STRAPI_URL = (import.meta as any).env.PUBLIC_STRAPI_URL || 'http://localhost:1337';
const CONTENT_TYPE = (import.meta as any).env.PUBLIC_CONTENT_TYPE || 'noticia';
const CONTENT_TYPE_PLURAL = (import.meta as any).env.PUBLIC_CONTENT_TYPE_PLURAL || 'noticias';

// Interfaces baseadas na resposta real
interface BlockChild {
  text: string;
  type: string;
}

interface ContentBlock {
  type: 'paragraph' | 'heading' | string;
  level?: number;
  children: BlockChild[];
}

interface MediaFormat {
  url: string;
  width: number;
  height: number;
  ext: string;
  mime: string;
  size: number;
}

interface Media {
  id: number;
  documentId?: string;
  url: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: MediaFormat;
    small?: MediaFormat;
    medium?: MediaFormat;
    large?: MediaFormat;
  };
}

interface Category {
  id: number;
  documentId?: string;
  name: string;
  slug: string;
}

export interface Tag {
  id: number;
  documentId?: string;
  name: string;
  slug: string;
}

export interface BettingHouse {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  logo?: Media;
  description?: string;
  welcomeBonus?: string;
  affiliateLink: string;
  rating: number;
  featured: boolean;
  corinthiansPartner: boolean;
  pros?: string[];
  cons?: string[];
  review?: ContentBlock[];
  active: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface BettingPrediction {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  match: string;
  prediction: string;
  predictionType: 'resultado' | 'gols' | 'handicap' | 'ambas_marcam' | 'cartoes' | 'escanteios' | 'primeiro_gol' | 'intervalo';
  odds?: number;
  confidence: 'baixa' | 'media' | 'alta';
  analysis: ContentBlock[];
  matchDate: string;
  sport: 'futebol' | 'basquete' | 'volei' | 'tenis' | 'outros';
  competition?: string;
  recommendedHouse?: BettingHouse;
  result: 'pendente' | 'acerto' | 'erro';
  featured: boolean;
  tags?: Tag[];
  authors?: Author[];
  coverImage?: Media;
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface Banner {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  image: Media;
  link?: string;
  popunderUrl?: string;
  ctaText?: string;
  description?: string;
  position: 'header' | 'sidebar' | 'footer' | 'between_posts' | 'popup' | 'floating';
  priority: number;
  startDate?: string;
  endDate?: string;
  active: boolean;
  targetBlank: boolean;
  bettingHouse?: BettingHouse;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

interface Author {
  id: number;
  documentId?: string;
  name: string;
  bio?: string;
  slug?: string | null;
  avatar?: Media;
  email?: string;
  linkedin?: string;
}

interface SEO {
  id?: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  metaImage?: Media;
}

export interface Post {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: ContentBlock[];
  coverImage?: Media;
  category?: Category;
  tags?: Tag[];
  authors?: Author[];
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  published?: string | null;
  updated?: string | null;
  seo?: SEO;
  single?: boolean;
}

 // Função para fazer requisições à API com populate correto
async function fetchAPI(endpoint: string, populate: boolean = false): Promise<any> {
  let url = `${STRAPI_URL}/api${endpoint}`;

  // Adicionar populate se necessário
  if (populate && !endpoint.includes('?')) {
    url += '?populate=*';
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Adicionar token se disponível
  const apiToken = import.meta.env.STRAPI_API_TOKEN || '7072b12f5e7a00bcaff69290682a55525c87bc62e1acaaea22ddb82a6ac0c1366beb3c9dac171866e1fb0ffc8ea2fa7119d0d1179a13e1469f462287846116dc65cb8ab086a8d783a346b1e038333d0cf9a1a13148ef095523d2e63eba08107386ed6b6c61e71d27889b3f3aab4513840e71a102d679a36c20582cb9be9bea0d';
  if (apiToken) {
    headers.Authorization = `Bearer ${apiToken}`;
  }

  try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      console.error(`API error: ${response.status} for ${url}`);
      return { data: [] };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    return { data: [] };
  }
}
 // Função otimizada para buscar um único post pelo slug (usando URL direta)
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    // Buscar diretamente pela URL do slug
    const url = `${STRAPI_URL}/api/${CONTENT_TYPE_PLURAL}/${slug}`;

    const response = await fetch(url);

    if (!response.ok) {
      // Se não encontrar pela URL direta, tentar pelo filtro
      const filterUrl = `${STRAPI_URL}/api/${CONTENT_TYPE_PLURAL}?filters[slug][$eq]=${slug}&populate[coverImage][fields][0]=url&populate[coverImage][fields][1]=alternativeText&populate[coverImage][fields][2]=formats&populate[category][fields][0]=name&populate[category][fields][1]=slug&populate[authors][populate][avatar]=true&populate[authors][fields][0]=name&populate[authors][fields][1]=bio&populate[authors][fields][2]=slug&populate[tags][fields][0]=name&populate[tags][fields][1]=slug&populate[seo][populate]=*`;

      const filterResponse = await fetch(filterUrl);

      if (!filterResponse.ok) {
        // Se ainda não encontrar, tentar buscar por slug que contenha o termo (slug parcial)
        const partialUrl = `${STRAPI_URL}/api/${CONTENT_TYPE_PLURAL}?filters[slug][$contains]=${slug}&populate[coverImage][fields][0]=url&populate[coverImage][fields][1]=alternativeText&populate[coverImage][fields][2]=formats&populate[category][fields][0]=name&populate[category][fields][1]=slug&populate[authors][populate][avatar]=true&populate[authors][fields][0]=name&populate[authors][fields][1]=bio&populate[authors][fields][2]=slug&populate[tags][fields][0]=name&populate[tags][fields][1]=slug&populate[seo][populate]=*`;
        
        const partialResponse = await fetch(partialUrl);
        if (partialResponse.ok) {
          const partialData = await partialResponse.json();
          const posts = partialData.data || [];
          if (posts.length > 0) {
            return posts[0];
          }
        }
        
        return null;
      }

      const filterData = await filterResponse.json();
      const posts = filterData.data || [];
      return posts.length > 0 ? posts[0] : null;
    }

    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Error in getPostBySlug:', error);
    return null;
  }
}

// Funções para Posts com populate correto
export async function getAllPosts(): Promise<Post[]> {
  try {
    const allPosts: Post[] = [];
    let page = 1;
    const pageSize = 100; // Buscar 100 posts por vez
    let hasMore = true;

    while (hasMore) {
      // URL com paginação e populate específico
      const url = `${STRAPI_URL}/api/${CONTENT_TYPE_PLURAL}?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate[coverImage][fields][0]=url&populate[coverImage][fields][1]=alternativeText&populate[coverImage][fields][2]=formats&populate[category][fields][0]=name&populate[category][fields][1]=slug&populate[authors][populate][avatar]=true&populate[authors][fields][0]=name&populate[authors][fields][1]=bio&populate[authors][fields][2]=slug&populate[tags][fields][0]=name&populate[tags][fields][1]=slug&populate[seo][populate]=*`;

      const response = await fetch(url);

      if (!response.ok) {
        console.error(`API error: ${response.status}`);
        break;
      }

      const data = await response.json();
      const posts = data.data || [];
      const pagination = data.meta?.pagination;

      // Filtrar posts sem slug ou com slug vazio
      const validPosts = posts.filter((post: any) => post.slug && post.slug.trim() !== '');

      allPosts.push(...validPosts);

      // Verificar se há mais páginas
      if (pagination) {
        hasMore = page < pagination.pageCount;
        page++;
      } else {
        hasMore = false;
      }
    }

    return allPosts;
  } catch (error) {
    console.error('Error in getAllPosts:', error);
    return [];
  }
}

export async function getPosts(limit = 10): Promise<Post[]> {
  const allPosts = await getAllPosts();
  // Filtrar posts single: true e ordenar por data de publicação ou criação
  const filteredPosts = allPosts.filter(post => post.single !== true);
  const sortedPosts = filteredPosts.sort((a, b) => {
    const dateA = new Date(a.publishedAt || a.createdAt).getTime();
    const dateB = new Date(b.publishedAt || b.createdAt).getTime();
    return dateB - dateA; // Mais recentes primeiro
  });
  return sortedPosts.slice(0, limit);
}

export async function getFeaturedPosts(limit = 3): Promise<Post[]> {
  const allPosts = await getAllPosts();
  // Pegar apenas posts com imagem de capa e filtrar posts single: true
  const postsWithImage = allPosts.filter(post => 
    post.coverImage?.url && post.single !== true
  );
  return postsWithImage.slice(0, limit);
}



// Funções para Categorias
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetchAPI('/categorias?populate=*');
    return response.data || [];
  } catch (error) {
    console.error('Error in getCategories:', error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find(cat => cat.slug === slug) || null;
}

export async function getPostsByCategory(categorySlug: string): Promise<{ data: Post[], meta: any }> {
  try {
    // Importar a função otimizada do strapi-paginated
    const { getAllPostsByCategory } = await import('./strapi-paginated');
    const posts = await getAllPostsByCategory(categorySlug);
    return {
      data: posts,
      meta: { pagination: { total: posts.length } }
    };
  } catch (error) {
    console.error('Error in getPostsByCategory:', error);
    return { data: [], meta: { pagination: { total: 0 } } };
  }
}

// Funções para Tags
export async function getTags(): Promise<Tag[]> {
  try {
    const response = await fetchAPI('/tags?populate=*');
    return response.data || [];
  } catch (error) {
    console.error('Error in getTags:', error);
    return [];
  }
}

export async function getPostsByTag(tagSlug: string): Promise<{ data: Post[], meta: any }> {
  try {
    // Importar a função otimizada do strapi-paginated
    const { getAllPostsByTag } = await import('./strapi-paginated');
    const posts = await getAllPostsByTag(tagSlug);
    return {
      data: posts,
      meta: { pagination: { total: posts.length } }
    };
  } catch (error) {
    console.error('Error in getPostsByTag:', error);
    return { data: [], meta: { pagination: { total: 0 } } };
  }
}


// Funções para Authors
export async function getAuthors(): Promise<Author[]> {
  try {
    const response = await fetchAPI('/authors?populate=avatar');
    return response.data || [];
  } catch (error) {
    console.error('Error in getAuthors:', error);
    return [];
  }
}

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  try {
    const authors = await getAuthors();
    const author = authors.find(author => author.slug === slug);
    
    if (!author) {
      return null;
    }
    
    return author;
  } catch (error) {
    console.error(`Error fetching author ${slug}:`, error);
    return null;
  }
}

export async function getAuthorById(id: number): Promise<Author | null> {
  try {
    const url = `${STRAPI_URL}/api/authors/${id}?populate=avatar`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error(`Error fetching author ${id}:`, error);
    return null;
  }
}

export async function getPostsByAuthor(authorSlug: string): Promise<{ data: Post[], meta: any }> {
  try {
    // Importar a função otimizada do strapi-paginated
    const { getAllPostsByAuthor } = await import('./strapi-paginated');
    const posts = await getAllPostsByAuthor(authorSlug);
    return {
      data: posts,
      meta: { pagination: { total: posts.length } }
    };
  } catch (error) {
    console.error('Error in getPostsByAuthor:', error);
    return { data: [], meta: { pagination: { total: 0 } } };
  }
}

// Helpers
export function getImageUrl(media?: Media, format: 'thumbnail' | 'small' | 'medium' | 'large' = 'medium'): string {
  if (!media || !media.url) return '/placeholder.svg';
  
  // Se tiver formato específico, usar
  if (media.formats && media.formats[format]) {
    const formatUrl = media.formats[format].url;
    if (formatUrl.startsWith('http')) {
      return formatUrl;
    }
    return `${STRAPI_URL}${formatUrl}`;
  }
  
  // Usar URL principal
  if (media.url.startsWith('http')) {
    return media.url;
  }
  
  return `${STRAPI_URL}${media.url}`;
}

export function formatDate(date?: string | null): string {
  if (!date) return '';
  
  try {
    const dateObj = new Date(date);
    
    // Verificar se a data é válida
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    
    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  } catch (error) {
    return '';
  }
}

export function formatDateShort(date?: string | null): string {
  if (!date) return '';
  
  try {
    const dateObj = new Date(date);
    
    // Verificar se a data é válida
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    
    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return '';
  }
}

export function renderBlocks(blocks: ContentBlock[]): string {
  if (!blocks || !Array.isArray(blocks)) return '';

  let html = '';

  for (const block of blocks) {
    if (!block.children) continue;

    let text = block.children.map(child => child.text || '').join('');

    // Converter &hellip; em ...
    text = text.replace(/&hellip;/g, '...');

    if (!text.trim()) continue;

    if (block.type === 'heading') {
      const level = block.level || 2;
      html += `<h${level} class="heading-${level}">${text}</h${level}>`;
    } else if (block.type === 'paragraph') {
      html += `<p class="paragraph">${text}</p>`;
    }
  }

  return html;
}

 // Função para pegar data de publicação ou criação
export function getPostDate(post: Post): string {
  // Prioridade: published > publishedAt > createdAt
  return post.published || post.publishedAt || post.createdAt;
}

// Função para pegar data de atualização
export function getPostUpdateDate(post: Post): string {
  // Prioridade: updated > updatedAt
  return post.updated || post.updatedAt || getPostDate(post);
}



// -------- BETTING HOUSES --------
export async function getBettingHouses(): Promise<BettingHouse[]> {
  try {
    const response = await fetchAPI('/betting-houses?populate=logo&sort=rating:desc');
    return response.data || [];
  } catch (error) {
    console.error('Error in getBettingHouses:', error);
    return [];
  }
}

export async function getFeaturedBettingHouses(limit = 6): Promise<BettingHouse[]> {
  try {
    const response = await fetchAPI(`/betting-houses?populate=logo&filters[featured][$eq]=true&sort=rating:desc&pagination[limit]=${limit}`);
    return response.data || [];
  } catch (error) {
    console.error('Error in getFeaturedBettingHouses:', error);
    return [];
  }
}

export async function getBettingHouseBySlug(slug: string): Promise<BettingHouse | null> {
  try {
    const response = await fetchAPI(`/betting-houses?populate=logo&filters[slug][$eq]=${slug}`);
    const houses = response.data || [];
    return houses.length > 0 ? houses[0] : null;
  } catch (error) {
    console.error('Error in getBettingHouseBySlug:', error);
    return null;
  }
}

// -------- BETTING PREDICTIONS --------
export async function getBettingPredictions(): Promise<BettingPrediction[]> {
  try {
    const response = await fetchAPI('/betting-predictions?populate[coverImage]=*&populate[recommendedHouse][populate][logo]=*&populate[tags]=*&populate[authors]=*&sort=matchDate:desc');
    return response.data || [];
  } catch (error) {
    console.error('Error in getBettingPredictions:', error);
    return [];
  }
}

export async function getFeaturedBettingPredictions(limit = 5): Promise<BettingPrediction[]> {
  try {
    const response = await fetchAPI(`/betting-predictions?populate[coverImage]=*&populate[recommendedHouse][populate][logo]=*&populate[tags]=*&populate[authors]=*&filters[featured][$eq]=true&sort=matchDate:desc&pagination[limit]=${limit}`);
    return response.data || [];
  } catch (error) {
    console.error('Error in getFeaturedBettingPredictions:', error);
    return [];
  }
}

export async function getUpcomingBettingPredictions(limit = 10): Promise<BettingPrediction[]> {
  try {
    const now = new Date().toISOString();
    const response = await fetchAPI(`/betting-predictions?populate[coverImage]=*&populate[recommendedHouse][populate][logo]=*&populate[tags]=*&populate[authors]=*&filters[matchDate][$gte]=${now}&sort=matchDate:asc&pagination[limit]=${limit}`);
    return response.data || [];
  } catch (error) {
    console.error('Error in getUpcomingBettingPredictions:', error);
    return [];
  }
}

export async function getBettingPredictionBySlug(slug: string): Promise<BettingPrediction | null> {
  try {
    const response = await fetchAPI(`/betting-predictions?populate[coverImage]=*&populate[recommendedHouse][populate][logo]=*&populate[tags]=*&populate[authors]=*&filters[slug][$eq]=${slug}`);
    const predictions = response.data || [];
    return predictions.length > 0 ? predictions[0] : null;
  } catch (error) {
    console.error('Error in getBettingPredictionBySlug:', error);
    return null;
  }
}

// -------- BANNERS --------

export async function getActiveBanners(position?: string): Promise<Banner[]> {
  try {
    const now = new Date().toISOString();
    let endpoint = `/banners?populate[image]=*&populate[bettingHouse][populate][logo]=*&filters[active][$eq]=true&sort=priority:desc`;
    
    if (position) {
      endpoint += `&filters[position][$eq]=${position}`;
    }
    
    // Filter by date range if dates are set
    endpoint += `&filters[$or][0][startDate][$null]=true&filters[$or][1][startDate][$lte]=${now}`;
    endpoint += `&filters[$or][0][endDate][$null]=true&filters[$or][1][endDate][$gte]=${now}`;
    
    const response = await fetchAPI(endpoint);
    return response.data || [];
  } catch (error) {
    console.error('Error in getActiveBanners:', error);
    return [];
  }
}

// -------- LEGACY BANNERS (keeping for compatibility) --------
interface BannerImageFormat {
  url: string;
  width: number;
  height: number;
  ext: string;
  mime: string;
  size: number;
}

interface BannerImage {
  id: number;
  documentId?: string;
  url: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: BannerImageFormat;
    small?: BannerImageFormat;
    medium?: BannerImageFormat;
    large?: BannerImageFormat;
  };
}

export interface Banner {
  id: number;
  documentId: string;
  title_banner: string;
  slug: string;
  local: string;
  url?: string;
  popunder_url?: string;  // Adicionando campo popunder_url
  cta_text?: string;      // Adicionando campo cta_text
  description?: string;   // Adicionando campo description
  image?: BannerImage;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
}

 // Cache para banners
const bannersCache: Map<string, { data: Banner[], time: number }> = new Map();
const BANNERS_CACHE_DURATION = 2 * 60 * 1000; // 2 minutos

export async function getBannersWithCache(local?: string): Promise<Banner[]> {
  const cacheKey = local || 'all';
  const now = Date.now();

  // Verificar cache
  const cached = bannersCache.get(cacheKey);
  if (cached && (now - cached.time) < BANNERS_CACHE_DURATION) {
    return cached.data;
  }

  let endpoint = '/banners?populate=image';
  if (local) endpoint += `&filters[local][$eq]=${local}`;

  const data = await fetchAPI(endpoint, true);
  const banners = data.data || [];

  // Atualizar cache
  bannersCache.set(cacheKey, { data: banners, time: now });

  return banners;
}

// Função otimizada para buscar apenas slugs (para getStaticPaths)
export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const allSlugs: string[] = [];
    let page = 1;
    const pageSize = 100;
    let hasMore = true;

    while (hasMore) {
      // Buscar apenas o campo slug
      const url = `${STRAPI_URL}/api/${CONTENT_TYPE_PLURAL}?fields[0]=slug&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;

      const response = await fetch(url);

      if (!response.ok) {
        console.error(`API error: ${response.status}`);
        break;
      }

      const data = await response.json();
      const posts = data.data || [];

      // Extrair apenas slugs válidos
      const slugs = posts
        .map((post: any) => post.slug)
        .filter((slug: string) => slug && slug.trim() !== '');

      allSlugs.push(...slugs);

      // Verificar se há mais páginas
      const pagination = data.meta?.pagination;
      if (pagination && pagination.page < pagination.pageCount) {
        page++;
      } else {
        hasMore = false;
      }
    }

    return allSlugs;  } catch (error) {
    console.error('Error in getAllPostSlugs:', error);
    return [];
  }
}

// Função otimizada para buscar posts recentes (para sidebar)
 // Função otimizada para buscar posts recentes (para sidebar)
export async function getRecentPosts(limit: number = 5): Promise<Post[]> {
  try {
    const url = `${STRAPI_URL}/api/${CONTENT_TYPE_PLURAL}?pagination[pageSize]=${limit * 2}&sort=publishedAt:desc`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error(`API error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    const posts = data.data || [];
    
    // Filtrar posts com single: true no JavaScript
    const filteredPosts = posts.filter((post: any) => post.single !== true);
    
    return filteredPosts.slice(0, limit);
  } catch (error) {
    console.error('Error in getRecentPosts:', error);
    return [];
  }
}


// Cache para dados do site
let siteDataCache: any = null;
let siteDataCacheTime: number = 0;
const SITE_DATA_CACHE_DURATION = 1 * 60 * 1000; // 1 minutos

export async function getSiteData() {
  // Verificar se o cache ainda é válido
  const now = Date.now();
  if (siteDataCache && (now - siteDataCacheTime) < SITE_DATA_CACHE_DURATION) {
    return siteDataCache;
  }

  try {
    // Buscar todos os campos necessários incluindo favicon
    const response = await fetch(`${STRAPI_URL}/api/home?populate=*`);
    if (!response.ok) return null;
    const { data } = await response.json();

    // Atualizar cache
    siteDataCache = data;
    siteDataCacheTime = now;

    return data;
  } catch (error) {
    console.error("Erro ao buscar dados do site:", error);
    return siteDataCache; // Retornar cache antigo em caso de erro
  }
}

// Função otimizada para buscar posts para a home com todos os campos necessários
export async function getHomePagePosts(limit: number = 500): Promise<Post[]> {
  try {
    const allPosts: Post[] = [];
    let page = 1;
    const pageSize = 100;
    let totalFetched = 0;

    while (totalFetched < limit) {
      const currentPageSize = Math.min(pageSize, limit - totalFetched);

      const url = `${STRAPI_URL}/api/${CONTENT_TYPE_PLURAL}?` +
        `pagination[page]=${page}&` +
        `pagination[pageSize]=${currentPageSize}&` +
        `populate[coverImage][fields][0]=url&` +
        `populate[coverImage][fields][1]=alternativeText&` +
        `populate[coverImage][fields][2]=formats&` +
        `populate[category][fields][0]=name&` +
        `populate[category][fields][1]=slug&` +
        `populate[authors][populate][avatar]=true&` +
        `populate[authors][fields][0]=name&` +
        `populate[authors][fields][1]=bio&` +
        `populate[authors][fields][2]=slug&` +
        `sort=publishedAt:desc`;

      const response = await fetch(url);

      if (!response.ok) {
        console.error(`API error: ${response.status}`);
        break;
      }

      const data = await response.json();
      const posts = data.data || [];

      // Filtrar posts com slug válido E posts com single: true
      const validPosts = posts.filter((post: Post) =>
        post.slug && 
        typeof post.slug === 'string' && 
        post.slug.trim() !== '' &&
        (post as any).single !== true
      );

      allPosts.push(...validPosts);
      totalFetched += posts.length;

      // Verificar se há mais páginas
      const pagination = data.meta?.pagination;
      if (!pagination || pagination.page >= pagination.pageCount || posts.length === 0) {
        break;
      }

      page++;
    }

    return allPosts.slice(0, limit);
  } catch (error) {
    console.error('Error in getHomePagePosts:', error);
    return [];
  }
}

// Interface para Marcas
interface Marca {
  id: number;
  documentId: string;
  marca: string;
  marca_link: string;
  marca_logo: Media;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Função para buscar marcas
export async function getMarcas(): Promise<Marca[]> {
  try {
    const url = `${STRAPI_URL}/api/marcas?populate=*`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`API error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error in getMarcas:', error);
    return [];
  }
}

// -------- HTMLS CUSTOMIZADOS --------
export interface CustomHTML {
  id: number;
  documentId: string;
  header?: string;
  body?: string;
  footer?: string;
  titile_html: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Cache para HTMLs customizados
const htmlsCache: Map<string, { data: CustomHTML[], time: number }> = new Map();
const HTMLS_CACHE_DURATION = 1 * 60 * 1000; // Reduzido para 1 minuto

export async function getCustomHTMLs(): Promise<CustomHTML[]> {
  const cacheKey = 'all';
  const now = Date.now();

  // Verificar cache
  const cached = htmlsCache.get(cacheKey);
  if (cached && (now - cached.time) < HTMLS_CACHE_DURATION) {
    return cached.data;
  }

  // Usar URL direta da API do Strapi com cache-busting
  const apiUrl = `https://strapiklaos.klaos.curitiba.br/api/htmls?_t=${now}`;
  
  try {
    const response = await fetch(apiUrl, {
      cache: 'no-cache', // Forçar busca sem cache do navegador
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      const htmls = data.data || [];
      
      // Atualizar cache
      htmlsCache.set(cacheKey, { data: htmls, time: now });
      return htmls;
    }
  } catch (error) {
    console.error('Erro ao buscar HTMLs customizados:', error);
  }
  
  return [];
}

// Função para limpar cache manualmente
export function clearCustomHTMLCache(): void {
  htmlsCache.clear();
}

export async function getCustomHTMLByTitle(title: string): Promise<CustomHTML | null> {
  try {
    const htmls = await getCustomHTMLs();
    return htmls.find(html => html.titile_html === title) || null;
  } catch (error) {
    return null;
  }
}

export async function getCustomHTMLById(documentId: string): Promise<CustomHTML | null> {
  try {
    const data = await fetchAPI(`/htmls/${documentId}`, true);
    return data.data || null;
  } catch (error) {
    return null;
  }
}

// Função para decodificar HTML escapado
export function decodeCustomHTML(htmlString: string): string {
  if (!htmlString) return '';
  
  return htmlString
    // Decodificar entidades Unicode
    .replace(/\\u003C/g, '<')
    .replace(/\\u003E/g, '>')
    .replace(/\\u0026/g, '&')
    .replace(/\\u0022/g, '"')
    .replace(/\\u0027/g, "'")
    // Decodificar caracteres escapados
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\r/g, '\r')
    .replace(/\\\\/g, '\\')
    // Decodificar entidades HTML básicas
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/');
}



