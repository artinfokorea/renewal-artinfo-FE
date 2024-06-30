import withPWA from "next-pwa"
// import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */

const config = {
  env: {
    REST_API_BASE_URL: process.env.REST_API_BASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    KAKAO_API_KEY: process.env.KAKAO_API_KEY,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    NAVER_CLIENT_ID: process.env.NAVER_CLIENT_ID,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "artinfokorea.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "ycuajmirzlqpgzuonzca.supabase.co",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "artinfo.s3.ap-northeast-2.amazonaws.com",
        port: "",
        pathname: "**",
      },
    ],

    formats: ["image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
}

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

export default config

// export default withSentryConfig(nextConfig);
