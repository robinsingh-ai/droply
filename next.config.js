const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');
const withOffline = require('next-offline');
const withCSS = require('@zeit/next-css');

const nextConfig = {
  target: 'server',
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
        fs: 'empty'
      };
    }
    config.externals = [...config.externals, { bufferutil: "bufferutil", "utf-8-validate": "utf-8-validate" }];
    return config;
  },
  env: {
    NEXT_PUBLIC_VERCEL_URL: process.env.VERCEL_URL
  },
  // Add server configuration
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    staticFolder: '/static',
  },
  // Add WebSocket configuration
  webpackDevMiddleware: config => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }
    return config
  },
  async headers() {
    return [
      {
        source: '/api/peer',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-Requested-With,content-type,Authorization' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' }
        ],
      },
    ]
  }
};

module.exports = withPlugins([
  [withCSS],
  [optimizedImages, {
    handleImages: ['jpeg', 'png', 'svg', 'webp', 'gif'],
  }],
  [withOffline]
], nextConfig);