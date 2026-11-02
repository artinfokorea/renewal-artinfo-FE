import BottomNavigation from "@/components/layouts/BottomNavigation"
import Header from "@/components/layouts/Header"
import { ProfileNavigation } from "@/components/profile/ProfileNavigation"
import { ProfileSideBar } from "@/components/profile/ProfileSideBar"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "마이페이지 | 아트인포",
  robots: { index: false, follow: false },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="pb-40 md:pb-20">
        <section className="mx-auto flex max-w-screen-lg md:mt-12">
          <ProfileSideBar />
          <div className="flex w-full flex-col px-4 py-8">
            {/* <ProfileNavigation /> */}
            {children}
          </div>
        </section>
      </main>
      <BottomNavigation />
    </>
  )
}
