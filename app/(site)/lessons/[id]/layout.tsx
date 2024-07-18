import { getLesson } from "@/apis/lessons"
import type { Metadata } from "next"

interface Props {
  params: { id: string; lng?: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params
  const data = await getLesson(Number(id))

  const pageTitle = data?.name
  const pageDescription = data?.majors && data?.majors.join(", ")
  const pageImage = data?.imageUrl

  return {
    title: `레슨 | ${pageTitle}`,
    description: `아트인포 | ${pageDescription} 레슨 ${pageTitle}`,
    openGraph: {
      title: pageTitle,
      description: `아트인포 | ${pageDescription} 레슨 ${pageTitle} `,
      images: {
        url:
          pageImage ??
          "https://artinfo.s3.ap-northeast-2.amazonaws.com/prod/upload/1710/images/20240718/original/CQXcP0odQYM.1721277434724.png",
        alt: "아트인포-ARTINFO",
      },
    },
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
