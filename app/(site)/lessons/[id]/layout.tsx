import GetQueryClient from "@/app/GetQueryClient"
import { queries } from "@/lib/queries"
import type { Metadata } from "next"

interface Props {
  params: { id: string; lng?: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const queryClient = GetQueryClient()
  const { id } = params

  const data = await queryClient.fetchQuery(queries.lessons.detail(Number(id)))

  const pageTitle = data?.name
  const pageDescription = data?.majors && data?.majors.join(", ")
  const pageImage = data?.imageUrl
  const defaultImage = "/img/metadata_image.png"

  return {
    title: `레슨 | ${pageTitle}`,
    description: `아트인포 | ${pageDescription} 레슨 ${pageTitle}`,
    openGraph: {
      title: pageTitle,
      description: `아트인포 | ${pageDescription} 레슨 ${pageTitle} `,
      images: {
        url: pageImage || defaultImage,
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
