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
    description: `아트인포 | ${pageDescription}`,
    openGraph: {
      title: `뉴스 | ${pageTitle}`,
      description: `아트인포 | ${pageDescription}`,
      images: {
        url:
          pageImage ??
          "https://artinfo.s3.ap-northeast-2.amazonaws.com/prod/upload/1710/images/20240718/original/CQXcP0odQYM.1721277434724.png",
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
