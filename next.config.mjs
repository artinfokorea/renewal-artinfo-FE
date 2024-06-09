import withPWA from 'next-pwa';
// import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */

const config = {
  env: {
    REST_API_BASE_URL: process.env.REST_API_BASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'https://artinfokorea.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'ycuajmirzlqpgzuonzca.supabase.co',
        port: '',
        pathname: '**',
      },
    ],
    formats: ['image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

// const nextConfig = withPWA({
//   dest: "public",
//   // disable: !isProduction,
//   runtimeCaching: [],
// })(config);

// const sentryWebpackPluginOptions = {
//   org: 'artinfo',
//   project: 'javascript-nextjs',
//   silent: true,
//   widenClientFileUpload: true,
//   transpileClientSDK: true,
//   tunnelRoute: '/monitoring',
//   hideSourceMaps: true,
//   disableLogger: true,
//   automaticVercelMonitors: true,
// };

export default config;

// export default withSentryConfig(nextConfig);
