"use client"

import { deleteLesson, updateLesson } from "@/apis/lessons"
import LessonDetailContainer from "@/components/lessons/LessonDetailContainer"
import LessonForm, { LessonFormData } from "@/components/lessons/LessonForm"
import useMutation from "@/hooks/useMutation"
import { LessonPayload } from "@/interface/lessons"
import { queries } from "@/lib/queries"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useParams, usePathname, useSearchParams } from "next/navigation"

const page = () => {
  const searchParams = useSearchParams()
  const pageType = searchParams.get("type")
  const params = useParams()
  const pathname = usePathname()

  const { data: lesson } = useSuspenseQuery(
    queries.lessons.detail(Number(params.id)),
  )

  const { handleForm, isLoading, handleDelete } = useMutation<LessonPayload>({
    createFn: (payload: LessonPayload) => updateLesson(payload),
    deleteFn: deleteLesson,
    queryKey: [...queries.lessons._def],
    redirectPath: pathname.slice(0, pathname.lastIndexOf("/")),
    successMessage: {
      create: "레슨이 수정되었습니다.",
      delete: "레슨이 삭제되었습니다.",
    },
  })

  const handleLessonForm = async (payload: LessonFormData) => {
    const { areas, pay, imageUrl, introduction, career } = payload

    await handleForm({
      areas,
      pay,
      imageUrl,
      introduction,
      career: career || "",
    })
  }

  return (
    <section className="mx-auto max-w-screen-lg">
      {pageType === "edit" ? (
        <LessonForm
          lesson={lesson}
          handleLesson={handleLessonForm}
          isFormLoading={isLoading}
        />
      ) : (
        <LessonDetailContainer lesson={lesson} deleteLesson={handleDelete} />
      )}
    </section>
  )
}

export default page
