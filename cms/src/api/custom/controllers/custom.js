'use strict';

module.exports = {
  async noticias(ctx) {
    console.log('🔍 Custom endpoint called!');
    
    try {
      const { data } = await strapi.entityService.findMany('api::noticia.noticia', {
        populate: {
          coverImage: {
            fields: ['url', 'alternativeText', 'formats']
          },
          category: {
            fields: ['name', 'slug']
          },
          authors: {
            fields: ['name', 'slug'],
            populate: {
              avatar: {
                fields: ['url', 'alternativeText']
              }
            }
          },
          tags: {
            fields: ['name', 'slug']
          },
          seo: true,
        },
        fields: ['id', 'title', 'slug', 'excerpt', 'publishedAt', 'createdAt', 'single'],
        sort: { publishedAt: 'desc' },
        filters: {
          publishedAt: { $notNull: true }
        },
        ...ctx.query,
      });

      console.log(`✅ Found ${data?.length || 0} noticias via custom endpoint`);
      
      ctx.body = {
        data,
        meta: {
          pagination: {
            page: 1,
            pageSize: data?.length || 0,
            pageCount: 1,
            total: data?.length || 0,
          }
        }
      };
    } catch (error) {
      console.error('❌ Error in custom endpoint:', error);
      ctx.throw(500, 'Internal server error');
    }
  },
};