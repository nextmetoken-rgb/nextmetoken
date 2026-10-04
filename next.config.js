/** @type {import('next').NextConfig} */
const config = { reactStrictMode: true };
module.exports = process.env.NEXT_PUBLIC_SENTRY_DSN
  ? require('@sentry/nextjs').withSentryConfig(config, { silent: true, hideSourceMaps: true })
  : config;
