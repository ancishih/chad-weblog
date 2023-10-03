/** @type {import('next').NextConfig} */
// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: false,
// })
const nextConfig = {
  output: 'standalone',
  // pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  reactStrictMode: true,
  env: {
    APIKEY: process.env.APIKEY,
    BASE_URL: process.env.BASE_URL,
    APP_ENDPOINT: process.env.APP_ENDPOINT,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.snapi.dev',
        port: '',
        pathname: '/images/v1/**',
      },
      {
        protocol: 'https',
        hostname: 'financialmodelingprep.com',
        port: '',
        pathname: '/image-stock/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.financialmodelingprep.com',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
}

module.exports = nextConfig
