/* eslint-disable @typescript-eslint/no-require-imports */
const createBundleAnalyzerPlugin = require('@next/bundle-analyzer');

const {
  VERCEL_ENV = 'development',
  VERCEL_URL,
  VERCEL_GIT_COMMIT_REF,
  VERCEL_PROJECT_PRODUCTION_URL,
} = process.env;

const protocol = VERCEL_ENV === 'development' ? 'http' : 'https';
let url = VERCEL_URL ?? 'localhost:3000';

// Use Vercel's production URL for production deployments
if (VERCEL_ENV === 'production') {
  url = VERCEL_PROJECT_PRODUCTION_URL ?? url;
}

const baseUrl = `${protocol}://${url}`;

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  eslint: {
    // ESLint is run separately via `pnpm lint`. The root eslint config uses
    // plugins (airbnb, mocha, etc.) that aren't available in the dapp's
    // isolated install on Vercel. Skip during build to avoid false failures.
    ignoreDuringBuilds: true,
  },
  transpilePackages: [
    '@rainbow-me/rainbowkit',
    '@farcaster/frame-sdk',
    '@farcaster/frame-wagmi-connector',
  ],
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
  async rewrites() {
    return [
      {
        source: '/.well-known/farcaster.json',
        destination: '/api/farcaster',
      },
    ];
  },
  webpack: (config, { webpack }) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    config.plugins.push(
      new webpack.DefinePlugin({
        __SI_BASE_URL__: JSON.stringify(baseUrl),
      }),
    );
    return config;
  },
};

const withBundleAnalyzer = createBundleAnalyzerPlugin({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
