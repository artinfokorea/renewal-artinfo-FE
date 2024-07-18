import { getJob } from "@/apis/jobs"
import type { Metadata } from "next"

interface Props {
  params: { id: string }
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { id } = params
  const data = await getJob(Number(id))

  const pageTitle = data?.title
  const pageImage = data?.imageUrl

  return {
    title: `채용 | ${pageTitle}`,
    description: `아트인포 | ${data.companyName}`,
    openGraph: {
      title: pageTitle,
      description: `아트인포 | ${data.companyName}`,
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
