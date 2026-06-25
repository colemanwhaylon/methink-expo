// Learn more: https://docs.expo.dev/guides/customizing-metro/
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Bundle PDFs as static assets (the Docs module ships local PDF files).
// mp3 is already in Metro's default assetExts.
if (!config.resolver.assetExts.includes('pdf')) {
  config.resolver.assetExts.push('pdf');
}

module.exports = config;
