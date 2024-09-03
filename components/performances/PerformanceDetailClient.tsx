"use client"

import { queries } from "@/lib/queries"
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation"
import useMutation from "@/hooks/useMutation"
import PerformanceDetailContainer from "./PerformanceDetailContainer"
import { PERFORMANCE_DETAIL, PerformanceCategory } from "@/types/performances"
import { PerformancePayload } from "@/interface/performances"
import { deletePerformance, updatePerformance } from "@/services/performances"
import PerformanceForm, { PerformanceFormData } from "./PerformanceForm"

interface Props {
  performance: PERFORMANCE_DETAIL
}

const PerformanceDetailClient = ({ performance }: Props) => {
  const params = useParams()
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const pageType = searchParams.get("type") as "edit" | "create"

  const { handleSubmit, isLoading, handleDelete } =
    useMutation<PerformancePayload>({
      updateFn: (performanceId: number, payload: PerformancePayload) =>
        updatePerformance(performanceId, payload),
      deleteFn: (performanceId?: number) =>
        deletePerformance(performanceId as number),
      queryKey: queries.performances._def,
      redirectPath: pathname.slice(0, pathname.lastIndexOf("/")),
      successMessage: {
        create: "공연이 수정되었습니다.",
        delete: "공연이 삭제되었습니다.",
      },
    })

  const handlePerformanceForm = async (payload: PerformanceFormData) => {
    const {
      title,
      posterImageUrl,
      startAt,
      endAt,
      customAreaName,
      area,
      age,
      ticketPrice,
      cast,
      host,
      time,
      reservationUrl,
      introduction,
    } = payload

    await handleSubmit(
      {
        category: PerformanceCategory.CLASSIC,
        title,
        posterImageUrl,
        startAt,
        endAt,
        time,
        customAreaName: customAreaName || "",
        areaId: area?.id || undefined,
        age,
        ticketPrice,
        cast,
        host,
        reservationUrl: reservationUrl || "",
        introduction,
      },
      Number(params.id),
    )

    router.refresh()
  }

  return (
    <section className="mx-auto max-w-screen-lg">
      {pageType === "edit" ? (
        <PerformanceForm
          performance={performance}
          handlePerformanceForm={handlePerformanceForm}
          isFormLoading={isLoading}
        />
      ) : (
        <PerformanceDetailContainer
          performance={performance}
          deletePerformance={() => handleDelete(Number(params.id))}
        />
      )}
    </section>
  )
}

export default PerformanceDetailClient
