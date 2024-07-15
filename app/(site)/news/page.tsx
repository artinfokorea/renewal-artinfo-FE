import NewsContainer from "@/components/news/NewsContainer"
import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: `뉴스 | 아트인포`,
  description: `뉴스 | 아트인포`,
  openGraph: {
    title: `뉴스 | 아트인포`,
    description: `뉴스 | 아트인포`,
    images: {
      url: "https://ycuajmirzlqpgzuonzca.supabase.co/storage/v1/object/public/artinfo/concerts/288/1694427064047.jpg",
      alt: "아트인포-ARTINFO",
    },
  },
}

const page = () => {
  return <NewsContainer />
}

export default page
