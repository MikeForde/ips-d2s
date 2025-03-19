const webpack = require('webpack');

module.exports = function override(config) {
  // Ensure fallback modules are set for Webpack 5
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "buffer": require.resolve("buffer"),
    "process": require.resolve("process/browser"),  // Fix missing process
  };

  // Provide necessary polyfills
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process',  // Remove /browser to fix resolution issue
      Buffer: ['buffer', 'Buffer'],
    })
  ]);

  return config;
};
