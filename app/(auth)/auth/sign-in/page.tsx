import SignInForm from "@/components/form/user/SignInForm"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import React from "react"

const page = async () => {
  const session = await getServerSession()

  if (session) {
    redirect("/")
  }

  return <SignInForm />
}

export default page
