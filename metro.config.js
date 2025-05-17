/**
 * Metro configuration for React Native
 * https://github.com/facebook/metro
 */
const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts }
  } = await getDefaultConfig();

  return {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true
        }
      })
    },
    resolver: {
      assetExts: [...assetExts, 'wasm'],
      sourceExts: [...sourceExts, 'cjs']
    }
  };
})(); 