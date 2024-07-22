"use client"

import React, { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { createLesson, getLessonQualification } from "@/services/lessons"
import LessonForm, {
  LessonFormData,
} from "@/components/form/service/LessonForm"
import { queries } from "@/lib/queries"
import AlertDialog from "@/components/dialog/AlertDialog"
import { Button } from "@/components/ui/button"
import useMutation from "@/hooks/useMutation"
import { LessonPayload } from "@/interface/lessons"

const page = () => {
  const [qualificationErrorMessages, setQualificationErrorMessages] = useState()
  const [isQualificationDialog, setIsQualificationDialog] = useState(false)
  const [isDuplicateDialog, setIsDuplicateDialog] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const { handleForm, isLoading } = useMutation<LessonPayload>({
    createFn: (payload: LessonPayload) => createLesson(payload),
    queryKey: [...queries.lessons._def],
    redirectPath: pathname.slice(0, pathname.lastIndexOf("/")),
    successMessage: {
      create: "레슨이 수정되었습니다.",
    },
  })

  const handleLessonForm = async (payload: LessonFormData) => {
    const { areas, pay, imageUrl, introduction, career } = payload
    handleForm({
      areas,
      pay,
      imageUrl,
      introduction,
      career: career || "",
    })
  }

  useEffect(() => {
    getLessonQualification()
      .then(res => res.item)
      .catch((error: any) => {
        if (error.response?.data?.code === "LESSON-003") {
          setIsDuplicateDialog(true)
          setQualificationErrorMessages(error.response?.data?.message)
        } else {
          setIsQualificationDialog(true)
          setQualificationErrorMessages(error.response?.data?.message)
        }
      })
  }, [])
  return (
    <section className="mx-auto max-w-screen-lg">
      <LessonForm handleLesson={handleLessonForm} isFormLoading={isLoading} />
      <AlertDialog
        title="레슨 등록 권한이 없습니다."
        isOpen={isQualificationDialog}
        handleDialog={() => router.push("/my-profile")}
      >
        <div className="my-4 flex flex-col justify-center gap-4">
          <p className="text-sm text-silver md:text-base">
            {qualificationErrorMessages}
          </p>
          <Button
            onClick={() => router.push("/my-profile")}
            className="bg-main text-white hover:bg-blue-600"
          >
            프로필로 이동하기
          </Button>
        </div>
      </AlertDialog>
      <AlertDialog
        title="레슨 등록 제한"
        isOpen={isDuplicateDialog}
        handleDialog={() => router.push("/lessons")}
      >
        <div className="my-4 flex flex-col justify-center gap-4">
          <p className="text-sm text-silver md:text-base">
            {qualificationErrorMessages}
          </p>
          <Button
            onClick={() => router.push("/lessons")}
            className="bg-main text-white hover:bg-blue-600"
          >
            리스트로 이동하기
          </Button>
        </div>
      </AlertDialog>
    </section>
  )
}

export default page
