"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { queries } from "@/lib/queries"
import { createCompetition } from "@/services/competitions"
import { CompetitionPayload } from "@/interface/competitions"
import useMutation from "@/hooks/useMutation"
import useToast from "@/hooks/useToast"
import CompetitionForm, { CompetitionFormData } from "@/components/competitions/CompetitionForm"
import { toPayload } from "@/components/competitions/CompetitionDetailClient"

/** 콩쿠르 등록 — 저장되면 바로 그 공고 상세로 간다 (검토 중이면 나에게만 보임) */
const page = () => {
  const router = useRouter()
  const { successToast } = useToast()
  const { handleSubmit, isLoading } = useMutation<CompetitionPayload>({
    createFn: (payload: CompetitionPayload) => createCompetition(payload),
    queryKey: [...queries.competitions._def],
    successMessage: { create: "콩쿠르 등록을 요청했습니다." },
  })

  const onSubmit = async (form: CompetitionFormData) => {
    const response = (await handleSubmit(toPayload(form))) as { id: number; status: "REVIEW" | "PUBLISHED" } | undefined
    if (!response) return
    if (response.status === "REVIEW") successToast("확인 후 게시됩니다. 그 전까지는 나에게만 보여요.")
    router.replace(`/competitions/${response.id}`)
  }

  return <CompetitionForm isLoading={isLoading} onSubmit={onSubmit} />
}

export default page
