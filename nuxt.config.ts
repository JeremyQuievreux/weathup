// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/i18n', 'vuetify-nuxt-module', 'nuxt-mdi'],
  components: [
    {
      path: '~/components',
      pathPrefix: true,
    },
  ],
  css: ['~/assets/style/main.scss'],
  vuetify: {
  },
  i18n: {
    defaultLocale: 'en',
    detectBrowserLanguage: false,
    locales: [
      { code: 'en', name: 'English', file: 'en.json'},
      { code: 'fr', name: 'Français', file: 'fr.json' },
      { code: 'it', name: 'Italiano', file: 'it.json' },
      { code: 'es', name: 'Español', file: 'es.json' },
      { code: 'de', name: 'Deutsch', file: 'de.json' },
    ],
  },
})
