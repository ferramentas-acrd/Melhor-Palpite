// src/lib/strapi-webhook-setup.js
// Script para configurar webhooks no Strapi para invalidação de cache ISR

const WEBHOOK_EVENTS = [
  'entry.create',
  'entry.update',
  'entry.delete',
  'entry.publish',
  'entry.unpublish'
];

const CONTENT_TYPES = [
  'api::noticia.noticia',
  'api::categoria.categoria',
  'api::tag.tag',
  'api::autor.autor'
];

export async function setupStrapiWebhooks(strapiUrl, strapiToken, webhookUrl, webhookToken) {
  console.log('🔧 Configurando webhooks do Strapi para ISR...\n');
  
  const headers = {
    'Authorization': `Bearer ${strapiToken}`,
    'Content-Type': 'application/json'
  };
  
  try {
    // 1. Lista webhooks existentes
    console.log('📋 Verificando webhooks existentes...');
    const existingResponse = await fetch(`${strapiUrl}/api/webhooks`, { headers });
    
    if (!existingResponse.ok) {
      throw new Error(`Erro ao listar webhooks: ${existingResponse.status}`);
    }
    
    const existingWebhooks = await existingResponse.json();
    
    // 2. Remove webhooks antigos para o mesmo URL
    for (const webhook of existingWebhooks.data || []) {
      if (webhook.url === webhookUrl) {
        console.log(`🗑️  Removendo webhook antigo: ${webhook.name}`);
        await fetch(`${strapiUrl}/api/webhooks/${webhook.id}`, {
          method: 'DELETE',
          headers
        });
      }
    }
    
    // 3. Cria novo webhook para cada content type
    const webhooksCreated = [];
    
    for (const contentType of CONTENT_TYPES) {
      const webhookName = `ISR Cache Invalidation - ${contentType}`;
      const webhookData = {
        name: webhookName,
        url: webhookUrl,
        headers: {
          'x-webhook-token': webhookToken,
          'Content-Type': 'application/json'
        },
        events: WEBHOOK_EVENTS.map(event => `${contentType}.${event}`),
        enabled: true
      };
      
      console.log(`\n✨ Criando webhook: ${webhookName}`);
      console.log(`   URL: ${webhookUrl}`);
      console.log(`   Eventos: ${webhookData.events.join(', ')}`);
      
      const createResponse = await fetch(`${strapiUrl}/api/webhooks`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ data: webhookData })
      });
      
      if (!createResponse.ok) {
        const error = await createResponse.text();
        console.error(`❌ Erro ao criar webhook: ${error}`);
        continue;
      }
      
      const created = await createResponse.json();
      webhooksCreated.push(created.data);
      console.log(`✅ Webhook criado com sucesso! ID: ${created.data.id}`);
    }
    
    // 4. Resumo
    console.log('\n📊 Resumo da configuração:');
    console.log(`   Webhooks criados: ${webhooksCreated.length}`);
    console.log(`   URL de destino: ${webhookUrl}`);
    console.log(`   Content types monitorados: ${CONTENT_TYPES.join(', ')}`);
    console.log(`   Eventos capturados: ${WEBHOOK_EVENTS.join(', ')}`);
    
    return {
      success: true,
      webhooks: webhooksCreated
    };
    
  } catch (error) {
    console.error('\n❌ Erro ao configurar webhooks:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Script CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  
  if (args.length < 4) {
    console.log('Uso: node strapi-webhook-setup.js <STRAPI_URL> <STRAPI_TOKEN> <WEBHOOK_URL> <WEBHOOK_TOKEN>');
    console.log('\nExemplo:');
    console.log('node strapi-webhook-setup.js http://localhost:1337 your-api-token https://seu-site.com/apostas/__webhook seu-webhook-token');
    process.exit(1);
  }
  
  const [strapiUrl, strapiToken, webhookUrl, webhookToken] = args;
  
  setupStrapiWebhooks(strapiUrl, strapiToken, webhookUrl, webhookToken)
    .then(result => {
      if (result.success) {
        console.log('\n✅ Webhooks configurados com sucesso!');
        process.exit(0);
      } else {
        console.log('\n❌ Falha ao configurar webhooks');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('\n❌ Erro:', error);
      process.exit(1);
    });
}