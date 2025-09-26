import type { APIRoute } from 'astro';
import { searchPostsOptimized } from '../../../lib/search';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  
  // Extract search parameters - igual ao Strapi original
  const searchQuery = url.searchParams.get('q') || url.searchParams.get('filters[title][$containsi]') || '';
  const page = parseInt(url.searchParams.get('pagination[page]') || '1', 10);
  const pageSize = parseInt(url.searchParams.get('pagination[pageSize]') || '25', 10);

  // Se não há query, retorna todos os posts com paginação (igual ao Strapi)
  if (!searchQuery || searchQuery.trim().length < 1) {
    try {
      const strapiUrl = `https://strapiklaos.klaos.curitiba.br/api/noticias/busca?pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
      
      const response = await fetch(strapiUrl);
      if (!response.ok) {
        throw new Error(`Strapi API error: ${response.status}`);
      }
      
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60',
        },
      });
    } catch (error) {
      console.error('Error calling external Strapi:', error);
      return new Response(JSON.stringify({
        data: [],
        meta: {
          pagination: { page, pageSize, pageCount: 0, total: 0 }
        }
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  try {
    // Use the optimized search with pagination
    const result = await searchPostsOptimized(searchQuery, page, pageSize);

    // Return in Strapi-like format - igual à resposta que você mostrou
    return new Response(JSON.stringify({
      data: result.results,
      meta: {
        pagination: {
          page: page,
          pageSize: pageSize,
          pageCount: result.pagination.pageCount,
          total: result.pagination.total
        }
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60', // Cache for 1 minute
      },
    });
  } catch (error) {
    console.error('Strapi-like search endpoint error:', error);
    return new Response(JSON.stringify({
      data: [],
      meta: {
        pagination: {
          page: page,
          pageSize: pageSize,
          pageCount: 0,
          total: 0
        }
      },
      error: 'Internal server error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
