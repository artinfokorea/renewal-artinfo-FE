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

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return <>{children}</>
}

export default RootLayout
