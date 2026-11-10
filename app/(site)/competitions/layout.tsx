import { DEFAULT_OG_IMAGE } from "@/lib/seo"
import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: "콩쿠르 | 아트인포",
  description: "전국 음악 콩쿠르·경연대회의 접수 일정을 한곳에서. 접수중·마감임박 콩쿠르를 부문과 지역으로 찾아보세요.",
  alternates: { canonical: "/competitions" },
  openGraph: {
    title: "콩쿠르 | 아트인포",
    description: "전국 음악 콩쿠르·경연대회의 접수 일정을 한곳에서.",
    url: "/competitions",
    images: { url: DEFAULT_OG_IMAGE },
  },
}

const layout = ({ children }: { children: React.ReactNode }) => <>{children}</>

export default layout
