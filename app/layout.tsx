import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layouts/Header";
import BottomNavigation from "@/components/layouts/BottomNavigation";
import ClientProvider from "@/components/provider/ClientProvider";
import { Metadata, Viewport } from "next";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

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
  // verification: {
  //   other: {
  //     "naver-site-verification": ["eb1c30e483eed014548bceaa3325c74cc15490db"],
  //     "google-adsense-account": ["ca-pub-7139698395080232"],
  //   },
  // },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} touch-manipulation`}
        style={{ height: "calc(100vh - 156px)" }}
        suppressHydrationWarning
      >
        <ClientProvider>
          <Header />
          <main className="pb-20 md:pb-8">{children}</main>
          <BottomNavigation />
        </ClientProvider>
      </body>
    </html>
  );
}
