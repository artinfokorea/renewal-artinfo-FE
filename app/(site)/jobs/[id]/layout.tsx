import { getJob } from "@/apis/jobs"
import type { Metadata } from "next"

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params
  const data = await getJob(Number(id))

  const pageTitle = data?.title
  const pageImage = data?.imageUrl

  return {
    title: `채용 | ${pageTitle}`,
    description: `${pageTitle} | 아트인포`,
    openGraph: {
      title: pageTitle,
      description: "아트인포 채용",
      images: {
        url:
          pageImage ??
          "https://ycuajmirzlqpgzuonzca.supabase.co/storage/v1/object/public/artinfo/concerts/288/1694427064047.jpg",
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
