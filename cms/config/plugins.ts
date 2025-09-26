export default () => ({
  'users-permissions': {
    config: {
      jwt: {
        expiresIn: '7d',
      },
      grant: {
        email: {
          enabled: true,
          icon: 'envelope',
        },
        discord: {
          enabled: false,
        },
        facebook: {
          enabled: false,
        },
        google: {
          enabled: false,
        },
        github: {
          enabled: false,
        },
        microsoft: {
          enabled: false,
        },
        twitter: {
          enabled: false,
        },
        instagram: {
          enabled: false,
        },
        vk: {
          enabled: false,
        },
        twitch: {
          enabled: false,
        },
        linkedin: {
          enabled: false,
        },
        cognito: {
          enabled: false,
        },
        reddit: {
          enabled: false,
        },
        auth0: {
          enabled: false,
        },
        cas: {
          enabled: false,
        },
      },
    },
  },
});
