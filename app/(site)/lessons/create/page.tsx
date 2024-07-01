"use client"

import React, { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import useToast from "@/hooks/useToast"
import { useLoading } from "@toss/use-loading"
import { createLesson, getLessonQualification } from "@/apis/lessons"
import LessonForm, { LessonFormData } from "@/components/lessons/LessonForm"
import { useQueryClient } from "@tanstack/react-query"
import { queries } from "@/lib/queries"
import AlertDialog from "@/components/dialog/AlertDialog"

const page = () => {
  const { successToast, errorToast } = useToast()
  const [qualificationErrorMessages, setQualificationErrorMessages] = useState()
  const [isHandleFormLoading, handleFormTransition] = useLoading()
  const [isQualificationDialog, setIsQualificationDialog] = useState(false)
  const [isDuplicateDialog, setIsDuplicateDialog] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()

  const handleLessonForm = async (payload: LessonFormData) => {
    try {
      await handleFormTransition(createLesson(payload))
      successToast("레슨이 등록되었습니다.")
      queryClient.invalidateQueries({
        queryKey: queries.lessons._def,
      })
      router.push(pathname.slice(0, pathname.lastIndexOf("/")))
    } catch (error: any) {
      errorToast(error.message)
      console.log(error)
    }
  }

  useEffect(() => {
    getLessonQualification()
      .then(res => res.item)
      .catch((error: any) => {
        if (error.response?.data?.code === "LESSON-OO3") {
          setIsDuplicateDialog(true)
          setQualificationErrorMessages(error.response?.data?.message)
        } else {
          setIsQualificationDialog(true)
          setQualificationErrorMessages(error.response?.data?.message)
        }
      })
  }, [])
  return (
    <section className="max-w-screen-lg mx-auto">
      <LessonForm
        handleLesson={handleLessonForm}
        isFormLoading={isHandleFormLoading}
      />
      <AlertDialog
        title="레슨 등록 권한이 없습니다."
        description={qualificationErrorMessages}
        error
        isOpen={isQualificationDialog}
        handleDialog={() => router.push("/my-profile")}
      />
      <AlertDialog
        title="레슨 등록 제한"
        description={qualificationErrorMessages}
        error
        isOpen={isQualificationDialog}
        handleDialog={() => router.push("/lessons")}
      />
    </section>
  )
}

export default page