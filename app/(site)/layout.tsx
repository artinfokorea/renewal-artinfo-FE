import Header from "@/components/layouts/Header"
import BottomNavigation from "@/components/layouts/BottomNavigation"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="pb-40 md:pb-20">{children}</main>
      <BottomNavigation />
    </>
  )
}
