module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    console.log('🚀 Configuring public permissions...');
    
    try {
      // Get the Public role
      const publicRole = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { name: 'Public' } });

      if (!publicRole) {
        console.error('❌ Public role not found');
        return;
      }

      console.log('✅ Found Public role:', publicRole.id);

      // Content types to configure
      const contentTypes = [
        'api::noticia.noticia',
        'api::category.category', 
        'api::author.author',
        'api::tag.tag',
        'api::team.team',
        'api::game.game',
        'api::player.player',
        'api::betting-house.betting-house',
        'api::betting-prediction.betting-prediction',
        'api::banner.banner'
      ];

      // Actions to enable
      const actions = ['find', 'findOne'];

      for (const contentType of contentTypes) {
        for (const action of actions) {
          try {
            // Check if permission already exists
            const existingPermission = await strapi
              .query('plugin::users-permissions.permission')
              .findOne({
                where: {
                  role: publicRole.id,
                  action: `${contentType}.${action}`,
                },
              });

            if (!existingPermission) {
              // Create the permission
              await strapi
                .query('plugin::users-permissions.permission')
                .create({
                  data: {
                    role: publicRole.id,
                    action: `${contentType}.${action}`,
                    enabled: true,
                  },
                });
              
              console.log(`✅ Created permission: ${contentType}.${action}`);
            } else {
              // Update if exists but not enabled
              if (!existingPermission.enabled) {
                await strapi
                  .query('plugin::users-permissions.permission')
                  .update({
                    where: { id: existingPermission.id },
                    data: { enabled: true },
                  });
                
                console.log(`✅ Updated permission: ${contentType}.${action}`);
              } else {
                console.log(`ℹ️  Permission already exists: ${contentType}.${action}`);
              }
            }
          } catch (error) {
            console.error(`❌ Error configuring ${contentType}.${action}:`, error.message);
          }
        }
      }

      console.log('🎉 Public permissions configuration completed!');
      
    } catch (error) {
      console.error('❌ Error in bootstrap:', error);
    }
  },
};