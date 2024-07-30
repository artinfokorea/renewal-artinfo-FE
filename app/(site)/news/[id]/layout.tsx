import GetQueryClient from "@/app/GetQueryClient"
import { queries } from "@/lib/queries"
import type { Metadata } from "next"

interface Props {
  params: { id: string }
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const queryClient = GetQueryClient()
  const { id } = params
  const data = await queryClient.fetchQuery(queries.news.detail(Number(id)))

  const pageTitle = data?.title
  const pageDescription = data?.summary.substring(0, 40)
  const pageImage = data?.thumbnailImageUrl
  const defaultImage = "/img/metadata_image.png"

  return {
    title: `뉴스 | ${pageTitle}`,
    description: `아트인포 | ${pageDescription}`,
    openGraph: {
      title: `뉴스 | ${pageTitle}`,
      description: `아트인포 | ${pageDescription}`,
      images: {
        url: pageImage || defaultImage,
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
