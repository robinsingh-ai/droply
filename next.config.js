const withPlugins = require('next-compose-plugins');
const css = require('@zeit/next-css');
const OptimizedImages = require('next-optimized-images');
const withSourceMaps = require('@zeit/next-source-maps');
const withOffline = require('next-offline');
const withBundleAnalyzer = require('@next/bundle-analyzer');
const withYaml = require('next-plugin-yaml');
const path = require('path');

const customConfig = {
    // for turning of dev indicators
    devIndicators: {
        autoPrerender: false,
    },

    // Configure webpack to properly handle PeerJS with modern JS features
    webpack: (config, { isServer }) => {
        // This allows us to resolve .mjs files
        config.module.rules.push({
            test: /\.mjs$/,
            include: /node_modules/,
            type: 'javascript/auto',
        });
        
        // For Webpack 4, we need to use node: {} instead of fallback
        config.node = {
            ...config.node,
            fs: 'empty',
            net: 'empty',
            tls: 'empty',
            http: 'empty',
            https: 'empty'
        };
        
        // Ignore specific modules causing issues
        config.module.rules.push({
            test: /webrtc-adapter/,
            use: 'null-loader',
        });
        
        // Skip browser-only packages in server builds
        if (isServer) {
            const originalEntry = config.entry;
            config.entry = async () => {
                const entries = await originalEntry();
                
                // These packages cause 'document not defined' errors
                const browserPackages = ['blob-polyfill'];
                
                // Loop through entries and skip browser packages
                Object.keys(entries).forEach(entry => {
                    browserPackages.forEach(packageName => {
                        if (entries[entry].includes(packageName)) {
                            entries[entry] = entries[entry].filter(x => !x.includes(packageName));
                        }
                    });
                });
                
                return entries;
            };
            
            // Also externalize these packages
            config.externals = [
                ...(config.externals || []),
                'blob-polyfill',
            ];
        }
        
        return config;
    },

    //minify
    // webpack: (config, options) => {
    //     // config.plugins = config.plugins.filter(
    //     //     (plugin) => (plugin.constructor.name !== 'UglifyJsPlugin')
    //     // ),
    //     config.optimization.minimize = true;
    //     return config
    // },
    // used for developing inside docker container
    webpackDevMiddleware: config => {
        config.watchOptions = {
            poll: 1000,
            aggregateTimeout: 300,
        };
        return config

    },

    generateInDevMode: true,
    workboxOpts: {
        cleanupOutdatedCaches: true,
        runtimeCaching: [
            {
                urlPattern: /^https?.*/,
                handler: 'NetworkFirst',
                options: {
                    cacheName: 'offlineCache',
                    expiration: {
                        maxEntries: 200,
                    },
                },
            },
            {
                urlPattern: /.png$/,
                handler: 'CacheFirst'
            },
            {
                urlPattern: /.jpg$/,
                handler: 'CacheFirst'
            },
        ],
    },
};

module.exports = withPlugins([
    [withSourceMaps],
    [withOffline],
    [css],
    [withYaml],
    [withBundleAnalyzer, {
        enabled: process.env.ANALYZE === 'true',
    }],
    [OptimizedImages],
], customConfig);
