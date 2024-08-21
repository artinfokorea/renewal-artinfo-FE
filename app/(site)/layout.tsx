import Header from "@/components/layouts/Header"
import BottomNavigation from "@/components/layouts/BottomNavigation"
import { cookies } from "next/headers"
import GetQueryClient from "@/lib/GetQueryClient"
import { queries } from "@/lib/queries"
import { getUser } from "@/lib/serverUserFetch"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const accessToken = cookies().get("accessToken")
  const queryClient = GetQueryClient()

  if (accessToken) {
    await queryClient.prefetchQuery({
      queryKey: queries.users.detail().queryKey,
      queryFn: getUser,
    })
  }

  const dehydratedState = dehydrate(queryClient)

  return (
    <>
      <HydrationBoundary state={dehydratedState}>
        <Header />
        <main className="pb-40 md:pb-20">{children}</main>
        <BottomNavigation />
      </HydrationBoundary>
    </>
  )
}
