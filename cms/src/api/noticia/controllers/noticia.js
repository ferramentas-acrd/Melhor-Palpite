'use strict';

/**
 * noticia controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::noticia.noticia', ({ strapi }) => ({
  // Override default find to make it public
  async find(ctx) {
    console.log('🔍 Custom find method called for noticia');
    
    try {
      const { data, meta } = await strapi.entityService.findMany('api::noticia.noticia', {
        populate: {
          coverImage: true,
          category: true,
          authors: {
            populate: {
              avatar: true
            }
          },
          tags: true,
          seo: true,
        },
        sort: { publishedAt: 'desc' },
        filters: {
          publishedAt: { $notNull: true }
        },
        ...ctx.query,
      });

      console.log(`✅ Found ${data?.length || 0} noticias`);
      
      return { data, meta };
    } catch (error) {
      console.error('❌ Error in custom find:', error);
      throw error;
    }
  },

  // Override findOne method
  async findOne(ctx) {
    console.log('🔍 Custom findOne method called for noticia');
    
    try {
      const { id } = ctx.params;
      
      const entity = await strapi.entityService.findOne('api::noticia.noticia', id, {
        populate: {
          coverImage: true,
          category: true,
          authors: {
            populate: {
              avatar: true
            }
          },
          tags: true,
          seo: true,
        },
      });

      console.log(`✅ Found noticia: ${entity?.title || 'N/A'}`);
      
      return { data: entity };
    } catch (error) {
      console.error('❌ Error in custom findOne:', error);
      throw error;
    }
  },

  // Endpoint otimizado para listagem
  async listagem(ctx) {
    try {
      const { query } = ctx;
      
      // Parse dos parâmetros de query
      const page = parseInt(query.page) || 1;
      const pageSize = Math.min(parseInt(query.pageSize) || 25, 100);
      const featured = query.featured === 'true';
      
      // Configurar filtros base
      const filters = {
        $and: [
          { publishedAt: { $notNull: true } },
          { single: { $ne: true } }
        ]
      };
      
      // Aplicar filtros adicionais
      if (query.filters) {
        Object.assign(filters, query.filters);
      }
      
      // Se for featured, filtrar por posts com imagem
      if (featured) {
        filters.$and.push({ coverImage: { $notNull: true } });
      }
      
      // Buscar dados
      const { results: data, pagination } = await strapi.entityService.findPage(
        'api::noticia.noticia',
        {
          filters,
          populate: {
            coverImage: {
              fields: ['url', 'alternativeText', 'formats']
            },
            category: {
              fields: ['name', 'slug']
            },
            authors: {
              fields: ['name', 'slug']
            }
          },
          fields: ['id', 'title', 'slug', 'excerpt', 'publishedAt', 'createdAt', 'single'],
          sort: { publishedAt: 'desc' },
          page,
          pageSize
        }
      );
      
      ctx.body = {
        data,
        meta: {
          pagination
        }
      };
    } catch (error) {
      console.error('Erro no endpoint listagem:', error);
      ctx.throw(500, 'Erro interno do servidor');
    }
  }
}));