"use client"

import { deleteLesson, updateLesson } from "@/apis/lessons"
import LessonDetailContainer from "@/components/lessons/LessonDetailContainer"
import LessonForm, { LessonFormData } from "@/components/lessons/LessonForm"
import useMutation from "@/hooks/useMutation"
import useToast from "@/hooks/useToast"
import { LessonPayload } from "@/interface/lessons"
import { queries } from "@/lib/queries"
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
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
  const handleDeleteLesson = async () => {
    // handleDelete()
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

    await handleForm({
      areas,
      pay,
      imageUrl,
      introduction,
      career: career || "",
    })
  }

  // try {
  //   await handleFormTransition(
  //     updateLesson({
  //       areas,
  //       pay,
  //       imageUrl,
  //       introduction,
  //       career: career || "",
  //     }),
  //   )
  //   successToast("레슨이 수정되었습니다.")
  //   queryClient.invalidateQueries({
  //     queryKey: queries.lessons._def,
  //   })
  //   router.push(pathname)
  // } catch (error: any) {
  //   errorToast(error.message)
  //   console.log(error)
  // }

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
