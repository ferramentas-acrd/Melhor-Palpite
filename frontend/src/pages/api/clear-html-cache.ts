import type { APIRoute } from 'astro';
import { clearCustomHTMLCache } from '../../lib/strapi';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Limpar cache de HTMLs customizados
    clearCustomHTMLCache();
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Cache de HTMLs customizados limpo com sucesso',
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Erro ao limpar cache',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    message: 'Use POST para limpar o cache de HTMLs customizados',
    endpoint: '/api/clear-html-cache',
    method: 'POST'
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
