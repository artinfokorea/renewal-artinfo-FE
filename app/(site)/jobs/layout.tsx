import type { Metadata } from "next"
import { DEFAULT_OG_IMAGE } from "@/lib/seo"

export const metadata: Metadata = {
  title: "채용 | 아트인포",
  description:
    "예술단체, 종교기관, 대학·학원의 음악·예술 채용 공고와 단기 연주 구인을 한곳에서 확인하세요. 아트인포 채용",
  alternates: { canonical: "/jobs" },
  openGraph: {
    title: "채용 | 아트인포",
    description:
      "예술단체, 종교기관, 대학·학원의 음악·예술 채용 공고와 단기 연주 구인을 한곳에서 확인하세요. 아트인포 채용",
    url: "/jobs",
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
