"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { queries } from "@/lib/queries"
import useMutation from "@/hooks/useMutation"
import { PerformancePayload } from "@/interface/performances"
import { createPerformance } from "@/services/performances"
import PerformanceForm, {
  PerformanceFormData,
} from "@/components/performances/PerformanceForm"
import {
  PerformanceCategory,
  performanceCategoryArray,
} from "@/types/performances"
import FormTypeSelectDialog from "@/components/dialog/FormTypeSelectDialog"

const page = () => {
  const seasrchParams = useSearchParams()
  const category = seasrchParams.get("category") as PerformanceCategory
  const pathname = usePathname()
  const router = useRouter()

  const { handleSubmit, isLoading } = useMutation<PerformancePayload>({
    createFn: (payload: PerformancePayload) => createPerformance(payload),
    queryKey: [...queries.lessons._def],
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

    const newPerformance = await handleSubmit({
      category,
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

    if (newPerformance) {
      router.push(
        `${pathname.slice(0, pathname.lastIndexOf("/"))}/${newPerformance.item.id}`,
      )
    }
  }

  return (
    <section className="mx-auto max-w-screen-lg">
      {!category ? (
        <FormTypeSelectDialog<PerformanceCategory>
          handleSelected={(category: PerformanceCategory) =>
            router.push(`${pathname}?category=${category}`)
          }
          label="공연 선택"
          list={performanceCategoryArray}
        />
      ) : (
        <PerformanceForm
          handlePerformanceForm={handlePerformanceForm}
          isFormLoading={isLoading}
        />
      )}
    </section>
  )
}

export default page
