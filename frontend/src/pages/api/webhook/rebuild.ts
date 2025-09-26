import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Verificar se é uma requisição POST
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // Verificar token de segurança
    const authHeader = request.headers.get('authorization');
    const webhookSecret = process.env.WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error('WEBHOOK_SECRET não configurado');
      return new Response('Server configuration error', { status: 500 });
    }

    if (!authHeader || authHeader !== `Bearer ${webhookSecret}`) {
      console.error('Token de webhook inválido');
      return new Response('Unauthorized', { status: 401 });
    }

    // Parse do body do webhook
    const body = await request.json();

    // Verificar se é um evento de post/artigo
    const validEvents = ['entry.create', 'entry.update', 'entry.publish', 'entry.unpublish'];
    const validModels = ['post', 'artigo', 'noticia', 'aposta'];
    
    if (!validEvents.includes(body.event)) {
      return new Response('Event ignored', { status: 200 });
    }

    if (!validModels.includes(body.model)) {
      return new Response('Model ignored', { status: 200 });
    }

    // Disparar rebuild baseado no ambiente
    const rebuildUrl = process.env.REBUILD_WEBHOOK_URL;
    const deployHook = process.env.DEPLOY_HOOK_URL;

    if (rebuildUrl) {
      // Para Vercel/Netlify com webhook de deploy
      const rebuildResponse = await fetch(rebuildUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          trigger: 'content-update',
          source: 'strapi-webhook',
          event: body.event,
          model: body.model,
          timestamp: new Date().toISOString()
        })
      });

      if (rebuildResponse.ok) {
        return new Response(JSON.stringify({
          success: true,
          message: 'Rebuild triggered successfully',
          event: body.event,
          model: body.model
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        console.error('❌ Erro ao disparar rebuild:', rebuildResponse.statusText);
        return new Response('Failed to trigger rebuild', { status: 500 });
      }
    } else if (deployHook) {
      // Para deploy hooks diretos (Vercel/Netlify)
      const deployResponse = await fetch(deployHook, {
        method: 'POST'
      });

      if (deployResponse.ok) {
        return new Response(JSON.stringify({
          success: true,
          message: 'Deploy triggered successfully',
          event: body.event,
          model: body.model
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        console.error('❌ Erro ao disparar deploy:', deployResponse.statusText);
        return new Response('Failed to trigger deploy', { status: 500 });
      }
    } else {
      // Log local para desenvolvimento
      return new Response(JSON.stringify({
        success: true,
        message: 'Webhook received - rebuild would be triggered in production',
        event: body.event,
        model: body.model,
        note: 'Configure REBUILD_WEBHOOK_URL or DEPLOY_HOOK_URL for automatic rebuilds'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('❌ Erro no webhook:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Permitir apenas POST
export const GET: APIRoute = () => {
  return new Response(JSON.stringify({
    message: 'Webhook endpoint - POST only',
    usage: 'Send POST requests with Strapi webhook data'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
