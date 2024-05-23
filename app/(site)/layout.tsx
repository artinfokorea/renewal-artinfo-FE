import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "아트인포-ARTINFO",
  description:
    "음악의 중심 아트인포! 클래식 채용, 레슨 등 모든 음악 정보를 아트인포에서 찾아보세요",
  // openGraph: {
  //   title: "아트인포-ARTINFO",
  //   description:
  //     "음악의 중심 아트인포! 클래식 채용, 레슨 등 모든 음악 정보를 아트인포에서 찾아보세요",
  //   url: "http://artinfokorea.com",
  //   siteName: "ARTINFO",
  //   locale: "ko-KR",
  //   type: "website",
  //   images: [
  //     {
  //       url: "https://ycuajmirzlqpgzuonzca.supabase.co/storage/v1/object/public/artinfo/concerts/289/1694427431399.jpg",
  //       width: 580,
  //       height: 580,
  //       alt: "아트인포-ARTINFO",
  //     },
  //   ],
  // },
  // manifest: "/manifest.json",
  // viewport: {
  //   width: "width=device-width",
  //   initialScale: 1,
  //   minimumScale: 1,
  //   viewportFit: "cover",
  //   maximumScale: 1,
  //   userScalable: false,
  // },
  // verification: {
  //   other: {
  //     "naver-site-verification": ["eb1c30e483eed014548bceaa3325c74cc15490db"],
  //     "google-adsense-account": ["ca-pub-7139698395080232"],
  //   },
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="pb-12 md:pb-8">{children}</main>;
}