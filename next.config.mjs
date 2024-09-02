import withPWAInit from "@ducanh2912/next-pwa"

/** @type {import('next').NextConfig} */

const isProduction = process.env.DEV_ENV === "production"

const config = {
  reactStrictMode: false,
  env: {
    NAVER_SECRET_KEY: process.env.NAVER_SECRET_KEY,
    DEV_ENV: process.env.DEV_ENV,
    REST_API_BASE_URL: process.env.REST_API_BASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
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

const withPWA = withPWAInit({
  dest: "public",
  disable: !isProduction,
  runtimeCaching: [],
})

const nextConfig = withPWA(config)

export default nextConfig
