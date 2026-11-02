import { Inter } from "next/font/google"
import "./globals.css"
import ClientProvider from "@/components/provider/ClientProvider"
import { Metadata, Viewport } from "next"
import Script from "next/script"
import * as gtag from "@/lib/gtag"
import JsonLd from "@/components/seo/JsonLd"
import { siteJsonLd } from "@/lib/jsonld"
import {
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
  DEFAULT_OG_IMAGE,
} from "@/lib/seo"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: "ARTINFO",
  keywords: [
    "아트인포",
    "클래식 채용",
    "음악 채용",
    "연주자 구인",
    "레슨",
    "공연 정보",
    "예술 뉴스",
  ],
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "ARTINFO",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 300,
        height: 300,
        alt: SITE_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  verification: {
    other: {
      "naver-site-verification": ["4871394d609daee93d74e672332148eb3c6b3fa9"],
      "google-adsense-account": ["ca-pub-7139698395080232"],
      "google-site-verification": [
        "xYjpBRtdcymBNXOmYXZca3KsqDIUd9CPUv3zeWLzXz0",
      ],
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body
        className={`${inter.className} touch-manipulation`}
        style={{ height: "calc(100vh - 156px)" }}
        suppressHydrationWarning
      >
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7139698395080232"
          crossOrigin="anonymous"
        />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
        />

        <Script
          id="gtag-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />

        <script src="https://developers.kakao.com/sdk/js/kakao.js" defer />
        <script
          src="https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js"
          defer
        />
        <JsonLd data={siteJsonLd()} />
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  )
}
