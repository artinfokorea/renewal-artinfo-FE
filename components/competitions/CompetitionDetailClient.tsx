"use client"

import React from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { queries } from "@/lib/queries"
import { deleteCompetition, updateCompetition } from "@/services/competitions"
import { CompetitionPayload } from "@/interface/competitions"
import { COMPETITION } from "@/types/competitions"
import useMutation from "@/hooks/useMutation"
import CompetitionDetailContainer from "./CompetitionDetailContainer"
import CompetitionForm, { CompetitionFormData } from "./CompetitionForm"
import { Spinner } from "../common/Loading"

interface Props {
  /** 서버에서 미리 받은 공고. 검토 중인 내 공고는 서버가 못 받으므로 브라우저에서 토큰으로 다시 조회한다 */
  initial: COMPETITION | null
  id: number
}

export const toPayload = (data: CompetitionFormData): CompetitionPayload => ({
  title: data.title,
  host: data.host,
  organizer: data.organizer || undefined,
  area: data.area,
  venue: data.venue || undefined,
  divisions: data.divisions,
  ages: data.ages ?? [],
  openAt: data.openAt,
  closeAt: data.closeAt,
  heldAt: data.heldAt || undefined,
  resultAt: data.resultAt || undefined,
  fee: data.fee || undefined,
  applyMethod: data.applyMethod,
  applyLink: data.applyMethod === "LINK" ? data.applyLink || undefined : undefined,
  tel: data.tel || undefined,
  email: data.email || undefined,
  prize: data.prize || undefined,
  description: data.description || undefined,
  posterUrl: data.posterUrl || undefined,
  contentImages: data.contentImages ?? [],
})

const CompetitionDetailClient = ({ initial, id }: Props) => {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isEdit = searchParams.get("type") === "edit"

  const { data, isLoading, isError } = useQuery({
    ...queries.competitions.detail(id),
    initialData: initial ?? undefined,
    staleTime: 60 * 1000,
  })

  const { handleSubmit, handleDelete, isLoading: isMutating } = useMutation<CompetitionPayload>({
    updateFn: (competitionId: number, payload: CompetitionPayload) => updateCompetition(competitionId, payload),
    deleteFn: (competitionId?: number) => deleteCompetition(competitionId as number),
    queryKey: [...queries.competitions._def],
    successMessage: { update: "공고를 수정했습니다.", delete: "공고를 삭제했습니다." },
  })

  const onUpdate = async (form: CompetitionFormData) => {
    const response = await handleSubmit(toPayload(form), Number(params.id))
    if (response) {
      router.replace(`/competitions/${params.id}`)
      router.refresh()
    }
  }

  const onDelete = async () => {
    await handleDelete(Number(params.id))
    router.replace("/competitions")
  }

  if (!data) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4 text-center text-[15px] text-coolgray">
        {isLoading ? <Spinner className="h-8 w-8" /> : isError ? "공고를 찾을 수 없거나 아직 게시되지 않았습니다." : null}
      </div>
    )
  }

  return isEdit ? (
    <CompetitionForm competition={data} isLoading={isMutating} onSubmit={onUpdate} />
  ) : (
    <CompetitionDetailContainer competition={data} deleteCompetition={onDelete} />
  )
}

export default CompetitionDetailClient
