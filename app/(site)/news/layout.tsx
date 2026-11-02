import type { Metadata } from "next"
import { DEFAULT_OG_IMAGE } from "@/lib/seo"

export const metadata: Metadata = {
  title: "뉴스 | 아트인포",
  description:
    "클래식, 국악, 무용 등 예술계 최신 뉴스와 콩쿠르 소식을 아트인포에서 읽어보세요.",
  alternates: { canonical: "/news" },
  openGraph: {
    title: "뉴스 | 아트인포",
    description:
      "클래식, 국악, 무용 등 예술계 최신 뉴스와 콩쿠르 소식을 아트인포에서 읽어보세요.",
    url: "/news",
    images: {
      url: DEFAULT_OG_IMAGE,
      alt: "아트인포-ARTINFO",
    },
  },
}

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return <>{children}</>
}

export default RootLayout
