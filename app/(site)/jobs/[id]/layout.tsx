import GetQueryClient from "@/lib/GetQueryClient"
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

  const data = await queryClient.fetchQuery(queries.jobs.detail(Number(id)))

  const pageTitle = data?.title
  const pageImage = data?.imageUrl
  const defaultImage = "/img/metadata_image.png"

  return {
    title: `채용 | ${pageTitle}`,
    description: `아트인포 | ${data.companyName}`,
    openGraph: {
      title: pageTitle,
      description: `아트인포 | ${data.companyName}`,
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
