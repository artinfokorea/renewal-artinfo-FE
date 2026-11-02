import type { Metadata } from "next"
import { DEFAULT_OG_IMAGE } from "@/lib/seo"

export const metadata: Metadata = {
  title: "공연 | 아트인포",
  description:
    "클래식, 뮤지컬, 무용, 국악 공연 일정과 출연진, 예매 정보를 아트인포에서 확인하세요.",
  alternates: { canonical: "/performances" },
  openGraph: {
    title: "공연 | 아트인포",
    description:
      "클래식, 뮤지컬, 무용, 국악 공연 일정과 출연진, 예매 정보를 아트인포에서 확인하세요.",
    url: "/performances",
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
