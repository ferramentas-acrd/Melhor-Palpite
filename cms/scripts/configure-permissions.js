const axios = require('axios');

async function configurePublicPermissions() {
  const apiUrl = 'http://localhost:1337';
  const token = '7072b12f5e7a00bcaff69290682a55525c87bc62e1acaaea22ddb82a6ac0c1366beb3c9dac171866e1fb0ffc8ea2fa7119d0d1179a13e1469f462287846116dc65cb8ab086a8d783a346b1e038333d0cf9a1a13148ef095523d2e63eba08107386ed6b6c61e71d27889b3f3aab4513840e71a102d679a36c20582cb9be9bea0d';
  
  // Configure axios with token
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
  // Configurar permissões públicas para todos os content types
  const contentTypes = [
    'noticia',
    'category',
    'author',
    'tag',
    'team',
    'game',
    'player',
    'betting-house',
    'betting-prediction', 
    'banner'
  ];

  // Configuração de permissões
  const permissions = {
    "noticia": ["find", "findOne"],
    "category": ["find", "findOne"],
    "author": ["find", "findOne"],
    "tag": ["find", "findOne"],
    "team": ["find", "findOne"],
    "game": ["find", "findOne"],
    "player": ["find", "findOne"],
    "betting-house": ["find", "findOne"],
    "betting-prediction": ["find", "findOne"],
    "banner": ["find", "findOne"]
  };

  try {
    // Get public role
    const rolesResponse = await axios.get(`${apiUrl}/users-permissions/roles`);
    const publicRole = rolesResponse.data.roles.find(role => role.name === 'Public');
    
    if (!publicRole) {
      throw new Error('Public role not found');
    }

    console.log('🔍 Found Public role:', publicRole.id);

    // Configure permissions for each content type
    const rolePermissions = { ...publicRole.permissions };

    contentTypes.forEach(contentType => {
      const apiName = `api::${contentType}.${contentType}`;
      
      if (!rolePermissions[apiName]) {
        rolePermissions[apiName] = {};
      }

      // Enable controllers
      if (!rolePermissions[apiName].controllers) {
        rolePermissions[apiName].controllers = {};
      }

      permissions[contentType].forEach(action => {
        if (!rolePermissions[apiName].controllers[contentType]) {
          rolePermissions[apiName].controllers[contentType] = {};
        }
        rolePermissions[apiName].controllers[contentType][action] = {
          enabled: true,
          policy: ""
        };
      });

      console.log(`✅ Configured permissions for ${contentType}: ${permissions[contentType].join(', ')}`);
    });

    // Update public role with new permissions
    const updateData = {
      name: publicRole.name,
      description: publicRole.description,
      type: publicRole.type,
      permissions: rolePermissions,
      users: publicRole.users
    };

    const updateResponse = await axios.put(`${apiUrl}/users-permissions/roles/${publicRole.id}`, updateData);
    
    console.log('🎉 Successfully updated public permissions!');
    console.log('📝 All content types now have public read access');
    
  } catch (error) {
    console.error('❌ Error configuring permissions:', error.response?.data || error.message);
  }
}

configurePublicPermissions();