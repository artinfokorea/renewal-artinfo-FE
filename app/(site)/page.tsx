import ArtContainer from "@/components/main/MainArtContainer"
import GetQueryClient from "@/lib/GetQueryClient"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { queries } from "@/lib/queries"
import { AdvertisementType } from "@/types/ads"
import { ProfessionalFieldTypes } from "@/types/majors"
import { JobType } from "@/types/jobs"
import BannerContainer from "@/components/main/BannerContainer"
import MainJobsContainer from "@/components/main/MainJobsContainer"
import CommunicationContainer from "@/components/main/CommunicationContainer"
import { LessonBanner } from "@/components/main/LessonBanner"

export const dynamic = "force-dynamic"

const page = async () => {
  const queryClient = GetQueryClient()

  try {
    await Promise.all([
      queryClient.prefetchQuery({
        ...queries.ads.list(AdvertisementType.CONCERT),
      }),
      queryClient.prefetchQuery({
        ...queries.ads.list(AdvertisementType.EXHIBITION),
      }),
      queryClient.prefetchQuery(
        queries.jobs.list({
          page: 1,
          size: 5,
          types: [JobType.ART_ORGANIZATION, JobType.LECTURER],
          professionalFields: [
            ProfessionalFieldTypes.CLASSIC,
            ProfessionalFieldTypes.POPULAR_MUSIC,
            ProfessionalFieldTypes.TRADITIONAL_MUSIC,
            ProfessionalFieldTypes.ADMINISTRATION,
            ProfessionalFieldTypes.ART,
          ],
        }),
      ),
      queryClient.prefetchQuery({
        ...queries.ads.list(AdvertisementType.BANNER),
      }),
      queryClient.prefetchQuery({
        ...queries.posts.list({
          page: 1,
          size: 5,
        }),
      }),
      queryClient.prefetchQuery({
        ...queries.news.list({
          page: 1,
          size: 5,
        }),
      }),
    ])
  } catch (error) {
    console.error("Failed to prefetch queries:", error)
  }

  const dehydratedState = dehydrate(queryClient)

  return (
    <div className="mx-auto h-full max-w-screen-lg px-4">
      <HydrationBoundary state={dehydratedState}>
        <BannerContainer />
        <ArtContainer type={AdvertisementType.CONCERT} title="공연" />
        <CommunicationContainer />
        <MainJobsContainer />
        <LessonBanner />
        <ArtContainer type={AdvertisementType.EXHIBITION} title="전시" />
      </HydrationBoundary>
    </div>
  )
}

export default page
