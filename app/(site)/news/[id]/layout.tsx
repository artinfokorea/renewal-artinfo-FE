import { getJob } from "@/apis/jobs"
import { getNewsDetail } from "@/apis/news"
import type { Metadata } from "next"

interface Props {
  params: { id: string }
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { id } = params
  const data = await getNewsDetail(Number(id))

  const pageTitle = data?.title
  const pageDescription = data?.summary.substring(0, 40)
  const pageImage = data?.thumbnailImageUrl

  return {
    title: `뉴스 | ${pageTitle}`,
    description: `${pageDescription} | 아트인포`,
    openGraph: {
      title: pageTitle,
      description: "아트인포 뉴스",
      images: {
        url:
          pageImage ??
          "https://ycuajmirzlqpgzuonzca.supabase.co/storage/v1/object/public/artinfo/concerts/288/1694427064047.jpg",
        alt: "아트인포-ARTINFO",
      },
    },
  }
}

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return <>{children}</>
}

export default RootLayout
