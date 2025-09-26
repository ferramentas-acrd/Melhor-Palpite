// Função para buscar redes sociais
const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL || 'http://localhost:1337';

interface SocialMedia {
  id: number;
  twitter?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  linkedin?: string | null;
  youtube?: string | null;
}

// Cache para redes sociais
let socialMediaCache: SocialMedia | null = null;
let socialMediaCacheTime = 0;
const SOCIAL_MEDIA_CACHE_DURATION = 60 * 60 * 1000; // 1 hora

export async function getSocialMedia(): Promise<SocialMedia | null> {
  try {
    // Verificar cache
    const now = Date.now();
    if (socialMediaCache && (now - socialMediaCacheTime) < SOCIAL_MEDIA_CACHE_DURATION) {
      return socialMediaCache;
    }

    const response = await fetch(`${STRAPI_URL}/api/home/social-news`);
    if (!response.ok) {
      console.error('Failed to fetch social media:', response.status);
      return null;
    }

    const data = await response.json();
    
    // Assumindo que a API retorna um array, pegamos o primeiro item
    socialMediaCache = data[0] || null;
    socialMediaCacheTime = now;
    
    return socialMediaCache;
  } catch (error) {
    console.error('Error fetching social media:', error);
    return null;
  }
}