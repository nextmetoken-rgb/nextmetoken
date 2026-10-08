/** @type {import('next').NextConfig} */
const config = { reactStrictMode: true, distDir: process.env.NEXT_DIST_DIR || '.next' };
module.exports = process.env.NEXT_PUBLIC_SENTRY_DSN
  ? require('@sentry/nextjs').withSentryConfig(config, { silent: true, hideSourceMaps: true })
  : config;
