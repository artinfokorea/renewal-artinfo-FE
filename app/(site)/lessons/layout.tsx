import type { Metadata } from "next"

export const metadata: Metadata = {
  title: `레슨 | 아트인포`,
  description: `레슨 | 아트인포`,
  openGraph: {
    title: `레슨 | 아트인포`,
    description: "아트인포 레슨",
    images: {
      url: "https://artinfo.s3.ap-northeast-2.amazonaws.com/prod/upload/1710/images/20240710/original/3jp88xoTO8r.1720575433094.png",
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
