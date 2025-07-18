module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        child_process: false,
        fs: false,
        'fs/promises': false,
        net: false,
        tls: false,
        'timers/promises': false,
      };
    }
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
};