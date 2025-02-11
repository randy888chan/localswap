const nextConfig = {
  webpack(config) {
    config.experiments = { 
      ...config.experiments,
      asyncWebAssembly: true,
      topLevelAwait: true 
    };
    
    // Required for BitcoinJS WASM modules
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'javascript/auto',
      loader: 'file-loader'
    });

    return config;
  }
}

module.exports = nextConfig;
