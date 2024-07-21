import { Metadata } from "next"

export const metadata: Metadata = {
  title: "로그인-ARTINFO",
  description:
    "예술의 중심 아트인포! 예술 채용, 레슨 등 모든 예술 정보를 아트인포에서 찾아보세요",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <main>{children}</main>
}
