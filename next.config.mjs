import withPWA from "next-pwa";
// import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */

const config = {
  // env: {
  //   TEST: process.env.TEST,
  // },
  images: {
    domains: ["ycuajmirzlqpgzuonzca.supabase.co", "www.sac.or.kr"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ycuajmirzlqpgzuonzca.supabase.co",
        port: "",
        pathname: "**",
      },
    ],
    formats: ["image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

const nextConfig = withPWA({
  dest: "public",
  // disable: !isProduction,
  runtimeCaching: [],
})(config);

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
