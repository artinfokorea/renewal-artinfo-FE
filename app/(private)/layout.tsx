import BottomNavigation from "@/components/layouts/BottomNavigation"
import Header from "@/components/layouts/Header"
import { ProfileSideBar } from "@/components/profile/ProfileSideBar"

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
          {children}
        </section>
      </main>
      <BottomNavigation />
    </>
  )
}
