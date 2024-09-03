"use client"

import { usePathname, useRouter } from "next/navigation"
import { queries } from "@/lib/queries"
import useMutation from "@/hooks/useMutation"
import { PerformancePayload } from "@/interface/performances"
import { createPerformance } from "@/services/performances"
import PerformanceForm, {
  PerformanceFormData,
} from "@/components/performances/PerformanceForm"
import { PerformanceCategory } from "@/types/performances"

const page = () => {
  const router = useRouter()
  const pathname = usePathname()

  const { handleSubmit, isLoading } = useMutation<PerformancePayload>({
    createFn: (payload: PerformancePayload) => createPerformance(payload),
    queryKey: [...queries.lessons._def],
    redirectPath: pathname.slice(0, pathname.lastIndexOf("/")),
    successMessage: {
      create: "공연이 등록되었습니다.",
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

    handleSubmit({
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
    })
  }

  return (
    <section className="mx-auto max-w-screen-lg">
      <PerformanceForm
        handlePerformanceForm={handlePerformanceForm}
        isFormLoading={isLoading}
      />
    </section>
  )
}

export default page
