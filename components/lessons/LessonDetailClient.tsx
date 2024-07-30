"use client"

import { deleteLesson, updateLesson } from "@/services/lessons"
import LessonDetailContainer from "@/components/lessons/LessonDetailContainer"
import LessonForm, { LessonFormData } from "@/components/lessons/LessonForm"
import useMutation from "@/hooks/useMutation"
import { LessonPayload } from "@/interface/lessons"
import { queries } from "@/lib/queries"
import { usePathname, useSearchParams } from "next/navigation"
import { LESSON } from "@/types/lessons"

interface Props {
  lesson: LESSON
}

const LessonDetailClient = ({ lesson }: Props) => {
  const searchParams = useSearchParams()
  const pageType = searchParams.get("type")
  const pathname = usePathname()

  const { handleSubmit, isLoading, handleDelete } = useMutation<LessonPayload>({
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

    await handleSubmit({
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

export default LessonDetailClient
