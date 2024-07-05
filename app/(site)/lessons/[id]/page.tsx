"use client"

import { deleteLesson, updateLesson } from "@/apis/lessons"
import LessonDetailContainer from "@/components/lessons/LessonDetailContainer"
import LessonForm, { LessonFormData } from "@/components/lessons/LessonForm"
import useToast from "@/hooks/useToast"
import { queries } from "@/lib/queries"
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { useLoading } from "@toss/use-loading"
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation"

const page = () => {
  const searchParams = useSearchParams()
  const pageType = searchParams.get("type")
  const params = useParams()
  const queryClient = useQueryClient()
  const { successToast, errorToast } = useToast()
  const router = useRouter()
  const [isHandleFormLoading, handleFormTransition] = useLoading()
  const pathname = usePathname()

  const { data: lesson } = useSuspenseQuery(
    queries.lessons.detail(Number(params.id)),
  )

  const handleDeleteLesson = async () => {
    try {
      await deleteLesson()
      successToast("레슨이 삭제되었습니다.")
      queryClient.invalidateQueries({
        queryKey: queries.lessons._def,
      })
      router.push(pathname.slice(0, pathname.lastIndexOf("/")))
    } catch (error: any) {
      errorToast(error.message)
      console.log("error", error)
    }
  }

  const handleLessonForm = async (payload: LessonFormData) => {
    const { areas, pay, imageUrl, introduction, career } = payload

    try {
      await handleFormTransition(
        updateLesson({
          areas,
          pay,
          imageUrl,
          introduction,
          career: career || "",
        }),
      )
      successToast("레슨이 수정되었습니다.")
      queryClient.invalidateQueries({
        queryKey: queries.lessons._def,
      })
      router.push(pathname)
    } catch (error: any) {
      errorToast(error.message)
      console.log(error)
    }
  }

  return (
    <section className="mx-auto max-w-screen-lg">
      {pageType === "edit" ? (
        <LessonForm
          lesson={lesson}
          handleLesson={handleLessonForm}
          isFormLoading={isHandleFormLoading}
        />
      ) : (
        <LessonDetailContainer
          lesson={lesson}
          deleteLesson={handleDeleteLesson}
        />
      )}
    </section>
  )
}

export default page
