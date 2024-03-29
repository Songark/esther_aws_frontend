const withCSS = require('@zeit/next-css')
const withImages = require('next-images');

module.exports = withImages(
  withCSS({
    exportTrailingSlash: true,
    exportPathMap: function() {
      return {
        '/': { page: '/' },
        '/contact': { page: '/contact' },
        '/terms': { page: '/terms' },
        '/privacy': { page: '/privacy' },
        '/login': { page: '/login' },
        '/logout': { page: '/logout' },
        '/register': { page: '/register' },
        '/blank-page': { page: '/blank-page' },
        '/chatbot': { page: '/chatbot' },
        '/upload': { page: '/upload' },
        '/profile': { page: '/profile' },
        '/users': { page: '/users' },
        '/training': { page: '/training' },
        '/capture': { page: '/capture' },
      };
    },
    publicRuntimeConfig: {
      localeSubpaths: typeof process.env.LOCALE_SUBPATHS === 'string'
        ? process.env.LOCALE_SUBPATHS
        : 'none',
    },
    webpack: (config, options) => {
      cssModules: true,
      //      config.module.rules.push({
      //          enforce: 'pre',
      //          test: /\.js?$/,
      //          exclude: [/node_modules/],
      //          loader: 'eslint-loader',
      //          options: {
      //            quiet: true,
      //          }
      //      });
      config.node = {
        fs: 'empty'
      }
      return config;
    }
  })
);
