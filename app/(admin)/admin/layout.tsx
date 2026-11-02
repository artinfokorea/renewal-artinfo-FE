import BottomNavigation from "@/components/layouts/BottomNavigation"
import Header from "@/components/layouts/Header"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "관리자 | 아트인포",
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="pb-40 md:pb-20">{children}</main>
      <BottomNavigation />
    </>
  )
}
