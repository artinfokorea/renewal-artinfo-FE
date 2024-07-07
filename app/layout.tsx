import { Inter } from "next/font/google"
import "./globals.css"
import ClientProvider from "@/components/provider/ClientProvider"
import { Metadata, Viewport } from "next"
import Script from "next/script"
import * as gtag from "@/lib/gtag"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  title: "아트인포-ARTINFO",
  description:
    "음악의 중심 아트인포! 클래식 채용, 레슨 등 모든 음악 정보를 아트인포에서 찾아보세요",
  openGraph: {
    title: "아트인포-ARTINFO",
    description:
      "음악의 중심 아트인포! 클래식 채용, 레슨 등 모든 음악 정보를 아트인포에서 찾아보세요",
    url: "http://artinfokorea.com",
    siteName: "ARTINFO",
    locale: "ko-KR",
    type: "website",
    images: [
      {
        url: "https://ycuajmirzlqpgzuonzca.supabase.co/storage/v1/object/public/artinfo/concerts/289/1694427431399.jpg",
        width: 580,
        height: 580,
        alt: "아트인포-ARTINFO",
      },
    ],
  },
  manifest: "/manifest.json",

  verification: {
    other: {
      "naver-site-verification": ["eb1c30e483eed014548bceaa3325c74cc15490db"],
      "google-adsense-account": ["ca-pub-713969839508023"],
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} touch-manipulation`}
        style={{ height: "calc(100vh - 156px)" }}
        suppressHydrationWarning
      >
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
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
        <Script
          src="https://developers.kakao.com/sdk/js/kakao.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js"
          strategy="beforeInteractive"
        />
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  )
}
