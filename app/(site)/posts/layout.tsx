import type { Metadata } from "next"
import { DEFAULT_OG_IMAGE } from "@/lib/seo"

export const metadata: Metadata = {
  title: "커뮤니티 | 아트인포",
  description:
    "후기, 질문, 홍보, 입시 정보를 나누는 예술인 커뮤니티. 아트인포 커뮤니티",
  alternates: { canonical: "/posts" },
  openGraph: {
    title: "커뮤니티 | 아트인포",
    description:
      "후기, 질문, 홍보, 입시 정보를 나누는 예술인 커뮤니티. 아트인포 커뮤니티",
    url: "/posts",
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
