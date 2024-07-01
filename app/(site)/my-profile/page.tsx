import ProfileContainer from "@/components/profile/ProfileContainer"
import React, { Suspense } from "react"
import Loading from "@/app/(site)/jobs/[id]/loading"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

const page = async () => {
  const session = await getServerSession()

  if (!session) redirect("/auth/sign-in")

  return (
    <Suspense fallback={<Loading />}>
      <ProfileContainer />
    </Suspense>
  )
}

export default page
