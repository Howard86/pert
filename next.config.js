const { PHASE_PRODUCTION_BUILD } = require('next/constants');

/** @type{import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    dirs: ['src', '__tests__'],
  },
  compiler: {
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },
};

module.exports = (phase) => {
  switch (phase) {
    case PHASE_PRODUCTION_BUILD: {
      const withBundleAnalyzer = require('@next/bundle-analyzer')({
        enabled: process.env.ANALYZE === 'true',
      });

      return withBundleAnalyzer(config);
    }

    default:
      return config;
  }
};
