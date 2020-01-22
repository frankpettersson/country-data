export default {
  mode: 'universal',
  head: {
    title: 'Country Data',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      },
      { name: 'robots', content: 'index' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  loading: { color: '#fff' },
  css: [],
  plugins: [],
  buildModules: [['@nuxt/typescript-build', { typeCheck: false }]],
  modules: ['@nuxtjs/axios', '@nuxtjs/pwa'],
  axios: {},
  typescript: {
    typeCheck: {
      eslint: true
    }
  },
  build: {
    extend(config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        });
      }
    }
  },
  manifest: {
    name: 'Country Data',
    lang: 'en'
  }
};
