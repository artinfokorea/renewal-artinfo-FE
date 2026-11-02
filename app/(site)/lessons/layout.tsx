import type { Metadata } from "next"
import { DEFAULT_OG_IMAGE } from "@/lib/seo"

export const metadata: Metadata = {
  title: "레슨 | 아트인포",
  description:
    "전공별, 지역별 클래식·실용음악·국악 레슨 강사를 찾아보세요. 학력과 경력, 레슨비를 확인하고 바로 문의할 수 있습니다.",
  alternates: { canonical: "/lessons" },
  openGraph: {
    title: "레슨 | 아트인포",
    description:
      "전공별, 지역별 클래식·실용음악·국악 레슨 강사를 찾아보세요. 학력과 경력, 레슨비를 확인하고 바로 문의할 수 있습니다.",
    url: "/lessons",
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
