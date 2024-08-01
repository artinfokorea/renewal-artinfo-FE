import withPWA from "next-pwa"

/** @type {import('next').NextConfig} */

const isProduction = process.env.NODE_ENV === "production"

const config = {
  reactStrictMode: false,
  env: {
    DEV_ENV: process.env.DEV_ENV,
    REST_API_BASE_URL: process.env.REST_API_BASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    DEV_ENV: process.env.DEV_ENV,
    GTAG_ID: process.env.GTAG_ID,
    AD_SENSE_ID: process.env.AD_SENSE_ID,
  },
  images: {
    remotePatterns: [
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
    minimumCacheTTL: 60,
  },
}

const nextConfig = withPWA({
  dest: "public",
  disable: !isProduction,
  runtimeCaching: [],
})(config)

export default nextConfig
