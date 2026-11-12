"use client"

import { ErrorMessage } from "@hookform/error-message"
import React, { useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { FieldErrors, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import dynamic from "next/dynamic"
import * as yup from "yup"
import { useLoading } from "@toss/use-loading"
import FileUploader from "../common/FileUploader"
import { Spinner } from "../common/Loading"
import PostCodeDialog from "../dialog/PostCodeDialog"
import MajorChipPicker from "./MajorChipPicker"
import { MAJOR } from "@/types/majors"
import { JOB, JobType, JobTypeList } from "@/types/jobs"
import useToast from "@/hooks/useToast"
import { jobSchema } from "@/lib/schemas"
import { uploadImages } from "@/services/system"
import { UploadTarget } from "@/types"

const CKEditor = dynamic(() => import("@/components/ckEditor/CKEditor"), {
  loading: () => (
    <div className="flex h-[400px] items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  ),
  ssr: false,
})

export type CreateFulltimeJobFormData = yup.InferType<typeof jobSchema>

interface Props {
  handleFullTimeJob: (payload: CreateFulltimeJobFormData, type: JobType) => void
  isLoading: boolean
  job?: JOB
  /** 등록 화면의 처음 분류 (링크로 넘어온 ?jobType=). 수정 화면은 job.type 으로 잠긴다 */
  initialType?: JobType
}

/** 분류별 짧은 설명 — 세그먼트 아래 작은 글씨 (데스크톱만) */
const TYPE_HINT: Record<JobType, string> = {
  [JobType.ART_ORGANIZATION]: "오케스트라·합창단·재단",
  [JobType.RELIGION]: "교회·성당 반주·성가대",
  [JobType.LECTURER]: "강사·교수·학원",
  [JobType.AMATEUR]: "",
  [JobType.YOUTH]: "",
}

const inputClass =
  "h-11 w-full rounded-[10px] border border-[#E5E8EB] bg-white px-3 text-[15px] text-[#191F28] placeholder:text-[#8B95A1] focus:border-[#191F28] focus:outline-none disabled:bg-[#F7F8FA]"
const Label = ({ children, required, hint }: { children: React.ReactNode; required?: boolean; hint?: string }) => (
  <label className="mb-1.5 block text-[13px] font-semibold text-[#4E5968]">
    {children}
    {required && <i className="ml-0.5 not-italic text-error">*</i>}
    {hint && <span className="ml-1.5 text-[12px] font-normal text-[#8B95A1]">{hint}</span>}
  </label>
)
const Field = ({ children, name, className = "" }: { children: React.ReactNode; name?: string; className?: string }) => (
  <div data-field={name} className={`mb-4 last:mb-0 ${className}`}>
    {children}
  </div>
)
const Err = ({ message }: { message: string }) => <p className="mt-1 text-xs font-medium text-error">{message}</p>
const Section = ({ title, optional, children }: { title: string; optional?: boolean; children: React.ReactNode }) => (
  <section className="mt-4 rounded-2xl border border-[#E5E8EB] p-5 md:p-6">
    <h2 className="mb-4 flex items-center gap-2 text-[16px] font-extrabold text-[#191F28]">
      {title}
      {optional && <span className="rounded-md bg-[#F7F8FA] px-1.5 py-0.5 text-[12px] font-semibold text-[#8B95A1]">선택</span>}
    </h2>
    {children}
  </section>
)

/** 등록 전 남은 필수 항목 수 — 하단 바에 보여 준다 (yup 스키마의 필수 항목과 같은 목록) */
const REQUIRED: (keyof CreateFulltimeJobFormData)[] = ["title", "companyName", "majors", "address", "addressDetail", "contents"]

/**
 * 채용 등록·수정 (예술단체·종교·대학/학원 공통). 연주 대타는 PartTimeForm.
 * 분류는 폼 맨 위 세그먼트로 고르고, 종교는 대표 이미지 없이 등록한다.
 * 라벨·필수 표시·섹션 카드는 콩쿠르 등록(CompetitionForm)과 같은 체계.
 */
const FullTimeJobForm = ({ handleFullTimeJob, isLoading, job, initialType }: Props) => {
  const router = useRouter()
  const fileUploader = useRef<HTMLInputElement>(null)
  const [isPostDialog, setIsPostDialog] = useState(false)
  const [type, setType] = useState<JobType>(job?.type ?? initialType ?? JobType.ART_ORGANIZATION)
  const { successToast, errorToast } = useToast()
  const [isUploadLoading, uploadTransition] = useLoading()
  const withImage = type !== JobType.RELIGION
  const types = JobTypeList.filter(item => item.value !== JobType.AMATEUR && item.value !== JobType.YOUTH)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<CreateFulltimeJobFormData>({
    resolver: yupResolver(jobSchema),
    defaultValues: {
      majors: job?.majors?.majors || [],
      title: job?.title || "",
      companyName: job?.companyName || "",
      addressDetail: job?.addressDetail || "",
      contents: job?.contents || "",
      address: job?.address || "",
      imageUrl: job?.imageUrl || "",
      recruitSiteUrl: job?.recruitSiteUrl || "",
    },
  })
  const values = watch()
  const remaining = REQUIRED.filter(key => {
    const value = values[key]
    return Array.isArray(value) ? value.length === 0 : !String(value ?? "").trim()
  }).length

  const handleUploadedFiles = async (files: File[]) => {
    try {
      const uploadResponse = await uploadTransition(uploadImages(UploadTarget.JOB, files, true))
      setValue("imageUrl", uploadResponse.images[0].url as string)
      successToast("대표 이미지를 올렸습니다.")
    } catch (error: any) {
      errorToast(error.message)
    }
  }

  const toggleMajor = (major: MAJOR) => {
    const current = watch("majors") || []
    const next = current.some(item => item.id === major.id) ? current.filter(item => item.id !== major.id) : [...current, major]
    setValue("majors", next, { shouldValidate: next.length > 0 })
    if (next.length > 0) clearErrors("majors")
  }

  /** 등록을 눌렀는데 틀린 칸이 있으면 첫 칸으로 옮기고 토스트로 알린다 */
  const onInvalid = (invalid: FieldErrors<CreateFulltimeJobFormData>) => {
    const first = Object.keys(invalid)[0]
    const firstMessage = Object.values(invalid).find(error => error?.message)?.message as string | undefined
    document.querySelector(`[data-field="${first}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" })
    errorToast(firstMessage ?? "입력을 확인해 주세요.")
  }

  return (
    <form
      onSubmit={handleSubmit(payload => handleFullTimeJob(payload, type), onInvalid)}
      className="mx-auto max-w-[720px] px-4 pb-44 pt-5 [overflow-wrap:anywhere] [word-break:keep-all] md:px-6 md:pt-10 lg:pb-28"
    >
      <h1 className="text-[22px] font-extrabold tracking-tight text-[#191F28] md:text-[26px]">{job ? "채용 수정" : "채용 등록"}</h1>
      <p className="mt-1 text-[13px] text-[#6B7684] md:text-[14px]">
        등록하면 바로 게시됩니다. <i className="not-italic text-error">*</i> 표시는 필수 항목입니다.
      </p>

      {/* 분류 — 수정 중에는 바꿀 수 없다 (목록·API 가 분류별이라) */}
      <div role="tablist" aria-label="채용 분류" className="mt-5 grid grid-cols-3 gap-1 rounded-[14px] bg-[#F7F8FA] p-1">
        {types.map(item => {
          const on = item.value === type
          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={on}
              disabled={!!job && !on}
              onClick={() => setType(item.value)}
              className={`flex h-11 flex-col items-center justify-center rounded-[10px] text-[14px] leading-tight disabled:opacity-40 md:h-12 ${on ? "bg-white font-bold text-[#191F28] shadow-sm" : "font-semibold text-[#6B7684]"}`}
            >
              {item.title}
              {TYPE_HINT[item.value] && <small className={`hidden text-[11px] font-medium md:block ${on ? "text-[#6B7684]" : "text-[#8B95A1]"}`}>{TYPE_HINT[item.value]}</small>}
            </button>
          )
        })}
      </div>

      {withImage && (
        <Section title="대표 이미지" optional>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => fileUploader.current?.click()}
              disabled={isUploadLoading}
              aria-label={values.imageUrl ? "대표 이미지 바꾸기" : "대표 이미지 올리기"}
              className="relative aspect-[400/244] w-[128px] shrink-0 overflow-hidden rounded-xl border border-dashed border-[#D1D6DB] bg-[#F7F8FA] md:w-[176px]"
            >
              {values.imageUrl ? (
                <Image src={values.imageUrl} alt="" fill sizes="176px" className="object-cover" />
              ) : (
                <span className="flex h-full flex-col items-center justify-center gap-1 text-[12px] font-semibold text-[#8B95A1] md:text-[13px]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <circle cx="9" cy="10" r="2" />
                    <path d="M21 16l-5-5-8 8" />
                  </svg>
                  이미지 선택
                </span>
              )}
              {isUploadLoading && (
                <span className="absolute inset-0 grid place-items-center bg-black/30">
                  <Spinner className="h-6 w-6" />
                </span>
              )}
            </button>
            <div className="min-w-0 text-[12px] leading-relaxed text-[#8B95A1] md:text-[13px]">
              <b className="block text-[13px] font-bold text-[#191F28] md:text-[14px]">이미지가 있는 공고가 더 많이 열립니다</b>
              <span className="hidden md:inline">목록 썸네일과 상세 상단에 보입니다. 포스터·로고·단체 사진 모두 괜찮습니다. 없으면 단체명으로 표시됩니다.</span>
              <span className="md:hidden">포스터·로고 모두 괜찮아요</span>
              {values.imageUrl && (
                <button type="button" onClick={() => setValue("imageUrl", "")} className="mt-1 block text-[12px] font-semibold text-[#6B7684] underline underline-offset-2">
                  이미지 지우기
                </button>
              )}
            </div>
          </div>
        </Section>
      )}

      <Section title="기본 정보">
        <Field name="title">
          <Label required>제목</Label>
          <div className="relative">
            <input {...register("title")} maxLength={50} placeholder="예) 2026 시즌 제2바이올린 단원 모집" className={`${inputClass} pr-14`} />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[#8B95A1]">{(values.title ?? "").length}/50</span>
          </div>
          <ErrorMessage errors={errors} name="title" render={({ message }) => <Err message={message} />} />
        </Field>
        <Field name="companyName">
          <Label required>단체명</Label>
          <input {...register("companyName")} maxLength={20} placeholder="예) 서울시립교향악단" className={inputClass} />
          <ErrorMessage errors={errors} name="companyName" render={({ message }) => <Err message={message} />} />
        </Field>
        <Field name="majors">
          <Label required hint="여러 개 선택">모집 전공</Label>
          <MajorChipPicker selected={values.majors || []} onToggle={toggleMajor} />
          <ErrorMessage errors={errors} name="majors" render={({ message }) => <Err message={message} />} />
        </Field>
      </Section>

      <Section title="근무지">
        <Field name="address">
          <Label required>주소</Label>
          <div className="flex gap-2">
            <input value={values.address} readOnly placeholder="주소 검색" onClick={() => setIsPostDialog(true)} className={`${inputClass} cursor-pointer`} />
            <button type="button" onClick={() => setIsPostDialog(true)} className="h-11 shrink-0 rounded-[10px] border border-[#E5E8EB] px-4 text-[14px] font-bold text-[#191F28]">
              검색
            </button>
          </div>
          <ErrorMessage errors={errors} name="address" render={({ message }) => <Err message={message} />} />
        </Field>
        <Field name="addressDetail">
          <Label required>상세 주소</Label>
          <input {...register("addressDetail")} placeholder="예) 3층 연습실" className={inputClass} />
          <ErrorMessage errors={errors} name="addressDetail" render={({ message }) => <Err message={message} />} />
        </Field>
      </Section>

      <Section title="접수" optional>
        <p className="-mt-2 mb-3 text-[13px] text-[#6B7684]">링크가 있으면 상세 화면에 지원하기 버튼이 생깁니다. 없으면 공고 내용의 안내를 따릅니다.</p>
        <Field name="recruitSiteUrl">
          <Label>접수 사이트 링크</Label>
          <input {...register("recruitSiteUrl")} inputMode="url" placeholder="https://" className={inputClass} />
          <ErrorMessage errors={errors} name="recruitSiteUrl" render={({ message }) => <Err message={message} />} />
        </Field>
      </Section>

      <Section title="공고 내용">
        <Field name="contents">
          <Label required>모집 분야, 자격, 전형 일정, 접수 방법, 문의처</Label>
          <div className="h-[320px] md:h-[460px]">
            <CKEditor value={values.contents} onChange={(value: string) => setValue("contents", value, { shouldValidate: !!value })} />
          </div>
          <ErrorMessage errors={errors} name="contents" render={({ message }) => <Err message={message} />} />
        </Field>
      </Section>

      {/* 하단 고정 바 — 남은 필수 항목 수 + 등록. lg 미만에서는 모바일 탭바(h-20) 위에 올린다 */}
      <div className="fixed inset-x-0 bottom-20 z-30 border-t border-[#E5E8EB] bg-white/90 backdrop-blur lg:bottom-0">
        <div className="mx-auto flex max-w-[720px] items-center gap-3 px-4 py-3 md:px-6">
          <span className="flex items-center gap-1.5 text-[13px] text-[#6B7684]">
            <i className={`h-2 w-2 rounded-full ${remaining ? "bg-error" : "bg-green"}`} />
            {remaining ? (
              <>
                필수 항목 <b className="text-error">{remaining}개</b> 남음
              </>
            ) : (
              <b className="text-green">등록할 수 있어요</b>
            )}
          </span>
          <span className="flex-1" />
          <button type="button" onClick={() => router.back()} className="hidden h-11 rounded-xl px-4 text-[14px] font-bold text-[#6B7684] md:block">
            취소
          </button>
          <button
            type="submit"
            disabled={isLoading || isUploadLoading}
            className="h-11 min-w-[120px] rounded-xl bg-[#191F28] px-6 text-[15px] font-bold text-white disabled:opacity-40"
          >
            {isLoading ? <Spinner className="mx-auto h-5 w-5" /> : job ? "수정하기" : "등록하기"}
          </button>
        </div>
      </div>

      <FileUploader ref={fileUploader} uploadedFiles={handleUploadedFiles} />
      <PostCodeDialog
        isOpen={isPostDialog}
        close={() => setIsPostDialog(false)}
        setValue={address => {
          setValue("address", address)
          clearErrors("address")
        }}
      />
    </form>
  )
}

export default FullTimeJobForm
