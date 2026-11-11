"use client"

import React, { useRef, useState } from "react"
import { FieldErrors, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { ErrorMessage } from "@hookform/error-message"
import { useLoading } from "@toss/use-loading"
import * as yup from "yup"
import { competitionSchema } from "@/lib/schemas"
import { uploadImages } from "@/services/system"
import { UploadTarget } from "@/types"
import { COMPETITION, COMPETITION_AGES, COMPETITION_AREAS, COMPETITION_DIVISIONS } from "@/types/competitions"
import useToast from "@/hooks/useToast"
import FileUploader from "../common/FileUploader"
import FallbackImage from "../common/FallbackImage"
import { Spinner } from "../common/Loading"

export type CompetitionFormData = yup.InferType<typeof competitionSchema>

interface Props {
  competition?: COMPETITION
  isLoading: boolean
  onSubmit: (data: CompetitionFormData) => void
}

const STEPS = ["기본 정보", "일정", "접수·시상", "포스터·확인"]
const STEP_FIELDS: (keyof CompetitionFormData)[][] = [
  ["title", "host", "organizer", "divisions", "ages", "area", "venue"],
  ["openAt", "closeAt", "heldAt", "resultAt"],
  ["applyMethod", "applyLink", "email", "tel", "fee", "prize"],
  ["posterUrl", "contentImages", "description"],
]

const inputClass =
  "h-11 w-full rounded-[10px] border border-[#E5E8EB] bg-white px-3 text-[15px] text-[#191F28] placeholder:text-[#8B95A1] focus:border-[#191F28] focus:outline-none"
const Label = ({ children, required, hint }: { children: React.ReactNode; required?: boolean; hint?: string }) => (
  <label className="mb-1.5 block text-[13px] font-semibold text-[#4E5968]">
    {children}
    {required && <i className="ml-0.5 not-italic text-error">*</i>}
    {hint && <span className="ml-1.5 text-[12px] font-normal text-[#8B95A1]">{hint}</span>}
  </label>
)
const Field = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => <div className={`mb-4 last:mb-0 ${className}`}>{children}</div>
const Err = ({ message }: { message: string }) => <p className="mt-1 text-xs font-medium text-error">{message}</p>

/**
 * 콩쿠르 등록·수정 — 4단계(기본 → 일정 → 접수·시상 → 포스터·확인). 단계마다 그 단계 필드만 검증하고 넘어간다.
 * 등록 직후에는 '검토 중'으로 본인에게만 보이고 아트인포가 확인한 뒤 게시된다.
 */
const CompetitionForm = ({ competition, isLoading, onSubmit }: Props) => {
  const fileUploader = useRef<HTMLInputElement>(null)
  const contentUploader = useRef<HTMLInputElement>(null)
  const { successToast, errorToast } = useToast()
  const [isUploadLoading, uploadTransition] = useLoading()
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<CompetitionFormData>({
    resolver: yupResolver(competitionSchema),
    defaultValues: {
      title: competition?.title ?? "",
      host: competition?.host ?? "",
      organizer: competition?.organizer ?? "",
      divisions: competition?.divisions ?? [],
      ages: competition?.ages ?? [],
      area: competition?.area ?? "",
      venue: competition?.venue ?? "",
      openAt: competition?.openAt ?? "",
      closeAt: competition?.closeAt ?? "",
      heldAt: competition?.heldAt ?? "",
      resultAt: competition?.resultAt ?? "",
      applyMethod: competition?.applyMethod ?? "LINK",
      applyLink: competition?.applyLink ?? "",
      email: competition?.email ?? "",
      tel: competition?.tel ?? "",
      fee: competition?.fee ?? "",
      prize: competition?.prize ?? "",
      description: competition?.description ?? "",
      posterUrl: competition?.posterUrl ?? "",
      contentImages: competition?.contentImages ?? [],
    },
  })

  const divisions = watch("divisions") ?? []
  const ages = watch("ages") ?? []
  const applyMethod = watch("applyMethod")
  const posterUrl = watch("posterUrl")
  const contentImages = (watch("contentImages") ?? []) as string[]

  const toggle = (key: "divisions" | "ages", value: string) => {
    const current = (watch(key) ?? []) as string[]
    setValue(key, current.includes(value) ? current.filter(v => v !== value) : [...current, value], { shouldValidate: true })
  }

  const handleUploadedFiles = async (files: File[]) => {
    try {
      const uploaded = await uploadTransition(uploadImages(UploadTarget.JOB, files, true))
      setValue("posterUrl", uploaded.images[0].url as string, { shouldDirty: true })
      successToast("포스터를 올렸습니다.")
    } catch (error: any) {
      errorToast(error.message)
    }
  }

  const handleContentFiles = async (files: File[]) => {
    if (contentImages.length + files.length > 20) {
      errorToast("본문 이미지는 20장까지 올릴 수 있습니다.")
      return
    }
    try {
      const uploaded = await uploadTransition(uploadImages(UploadTarget.JOB, files, true))
      setValue("contentImages", [...contentImages, ...uploaded.images.map(image => image.url as string)], { shouldDirty: true })
      successToast(`${uploaded.images.length}장을 올렸습니다.`)
    } catch (error: any) {
      errorToast(error.message)
    }
  }
  const removeContentImage = (index: number) => setValue("contentImages", contentImages.filter((_, i) => i !== index), { shouldDirty: true })

  const next = async () => {
    const valid = await trigger(STEP_FIELDS[step])
    if (!valid) {
      errorToast("입력을 확인해 주세요.")
      return
    }
    setStep(s => Math.min(s + 1, STEPS.length - 1))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  /** 오류가 난 필드가 어느 단계에 있는지 */
  const stepOf = (field: string) => STEP_FIELDS.findIndex(fields => fields.includes(field as keyof CompetitionFormData))
  const errorList = Object.entries(errors)
    .map(([field, error]) => ({ field, step: stepOf(field), message: (error as { message?: string })?.message ?? "" }))
    .filter(e => e.message)
    .sort((a, b) => a.step - b.step)

  /** 등록 버튼을 눌렀는데 다른 단계에 오류가 있으면 — 그 단계로 옮기고 무엇이 문제인지 바로 보여준다 */
  const onInvalid = (invalid: FieldErrors<CompetitionFormData>) => {
    setSubmitted(true)
    const first = Object.keys(invalid)
      .map(stepOf)
      .filter(i => i >= 0)
      .sort((a, b) => a - b)[0]
    const firstMessage = Object.values(invalid).find(e => e?.message)?.message as string | undefined
    if (first !== undefined && first !== step) setStep(first)
    errorToast(`${first !== undefined ? `${first + 1}단계 ` : ""}입력을 확인해 주세요${firstMessage ? `: ${firstMessage}` : "."}`)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const Chips = ({ options, selected, onToggle }: { options: string[]; selected: string[]; onToggle: (v: string) => void }) => (
    <div className="flex flex-wrap gap-2">
      {options.map(option => {
        const on = selected.includes(option)
        return (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            className={`h-9 rounded-full border px-3.5 text-[14px] ${on ? "border-main bg-[#E8F3FF] font-bold text-[#1B64DA]" : "border-[#E5E8EB] text-[#4E5968]"}`}
          >
            {option}
          </button>
        )
      })}
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="mx-auto max-w-[720px] px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <h1 className="text-[22px] font-extrabold tracking-tight text-[#191F28] md:text-[26px]">{competition ? "콩쿠르 수정" : "콩쿠르 등록"}</h1>
      {!competition && (
        <p className="mt-1.5 text-[14px] text-[#6B7684]">주최·주관 단체가 직접 올리는 공고입니다. 내용을 확인한 뒤 게시되며(보통 1영업일), 그 전까지는 나에게만 보입니다.</p>
      )}

      <div className="mb-1.5 mt-6 flex gap-1.5">
        {STEPS.map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-[#191F28]" : "bg-[#E5E8EB]"}`} />
        ))}
      </div>
      <div className="mb-5 flex justify-between text-[12px] text-[#8B95A1]">
        {STEPS.map((label, i) => (
          <span key={label} className={i === step ? "font-bold text-[#191F28]" : ""}>
            {i + 1} {label}
          </span>
        ))}
      </div>

      {/* 1 기본 정보 */}
      <section className={`rounded-2xl border border-[#E5E8EB] p-5 ${step === 0 ? "" : "hidden"}`}>
        <h2 className="mb-4 text-[16px] font-extrabold">기본 정보</h2>
        <Field>
          <Label required>대회명</Label>
          <input {...register("title")} placeholder="예) 제13회 수원시전국음악콩쿠르" className={inputClass} />
          <ErrorMessage errors={errors} name="title" render={({ message }) => <Err message={message} />} />
        </Field>
        <div className="grid grid-cols-1 gap-x-3 md:grid-cols-2">
          <Field>
            <Label required>주최</Label>
            <input {...register("host")} className={inputClass} />
            <ErrorMessage errors={errors} name="host" render={({ message }) => <Err message={message} />} />
          </Field>
          <Field>
            <Label>주관</Label>
            <input {...register("organizer")} placeholder="주최와 같으면 비워 두세요" className={inputClass} />
          </Field>
        </div>
        <Field>
          <Label required hint="여러 개 선택">부문</Label>
          <Chips options={COMPETITION_DIVISIONS} selected={divisions} onToggle={v => toggle("divisions", v)} />
          <ErrorMessage errors={errors} name="divisions" render={({ message }) => <Err message={message} />} />
        </Field>
        <Field>
          <Label hint="비우면 전연령">참가 대상</Label>
          <Chips options={COMPETITION_AGES} selected={ages} onToggle={v => toggle("ages", v)} />
        </Field>
        <div className="grid grid-cols-1 gap-x-3 md:grid-cols-2">
          <Field>
            <Label required>지역</Label>
            <select {...register("area")} className={inputClass}>
              <option value="">선택</option>
              {COMPETITION_AREAS.map(area => (
                <option key={area} value={area}>
                  {area === "전국" ? "전국(온라인)" : area}
                </option>
              ))}
            </select>
            <ErrorMessage errors={errors} name="area" render={({ message }) => <Err message={message} />} />
          </Field>
          <Field>
            <Label>대회 장소</Label>
            <input {...register("venue")} placeholder="예) 수원문화원 빛누리아트홀" className={inputClass} />
          </Field>
        </div>
      </section>

      {/* 2 일정 */}
      <section className={`rounded-2xl border border-[#E5E8EB] p-5 ${step === 1 ? "" : "hidden"}`}>
        <h2 className="mb-4 text-[16px] font-extrabold">일정</h2>
        <div className="grid grid-cols-1 gap-x-3 md:grid-cols-2">
          <Field>
            <Label required>접수 시작</Label>
            <input {...register("openAt")} type="date" className={inputClass} />
            <ErrorMessage errors={errors} name="openAt" render={({ message }) => <Err message={message} />} />
          </Field>
          <Field>
            <Label required hint="그날 23:59 까지로 표시">접수 마감</Label>
            <input {...register("closeAt")} type="date" className={inputClass} />
            <ErrorMessage errors={errors} name="closeAt" render={({ message }) => <Err message={message} />} />
          </Field>
          <Field>
            <Label>대회일</Label>
            <input {...register("heldAt")} type="date" className={inputClass} />
          </Field>
          <Field>
            <Label>결과 발표</Label>
            <input {...register("resultAt")} type="date" className={inputClass} />
          </Field>
        </div>
        <p className="rounded-xl bg-[#E8F3FF] px-4 py-3 text-[13px] leading-5 text-[#1B64DA]">접수 마감 3일 전에 관심 등록한 회원에게 알림이 나갑니다. 일정이 바뀌면 공고 상세에서 수정해 주세요.</p>
      </section>

      {/* 3 접수·시상 */}
      <section className={`rounded-2xl border border-[#E5E8EB] p-5 ${step === 2 ? "" : "hidden"}`}>
        <h2 className="mb-4 text-[16px] font-extrabold">접수 방법·시상</h2>
        <Field>
          <Label required>접수 방법</Label>
          <div className="flex flex-col gap-2">
            {(
              [
                ["LINK", "주최 홈페이지·접수 폼 링크", "참가자가 외부 페이지에서 접수합니다"],
                ["EMAIL", "이메일 접수", "참가 신청서를 메일로 받습니다"],
                ["POST", "우편·방문 접수", "주소와 안내를 소개란에 적어 주세요"],
                ["CONTACT", "전화 등 주최에 직접 문의", "접수 링크·이메일 없이 전화번호와 안내만 적습니다"],
              ] as const
            ).map(([value, label, desc]) => (
              <label
                key={value}
                className={`flex cursor-pointer items-start gap-2.5 rounded-xl border px-3.5 py-3 text-[14px] font-medium ${applyMethod === value ? "border-main bg-[#E8F3FF]" : "border-[#E5E8EB]"}`}
              >
                <input type="radio" value={value} {...register("applyMethod")} className="mt-1 accent-main" />
                <span>
                  {label}
                  <small className="mt-0.5 block text-[13px] font-normal text-[#6B7684]">{desc}</small>
                </span>
              </label>
            ))}
          </div>
        </Field>
        {applyMethod === "LINK" && (
          <Field>
            <Label required>접수 링크</Label>
            <input {...register("applyLink")} type="url" placeholder="https://" className={inputClass} />
            <ErrorMessage errors={errors} name="applyLink" render={({ message }) => <Err message={message} />} />
          </Field>
        )}
        <div className="grid grid-cols-1 gap-x-3 md:grid-cols-2">
          <Field>
            <Label required={applyMethod === "EMAIL"}>{applyMethod === "EMAIL" ? "접수 이메일" : "문의 이메일"}</Label>
            <input {...register("email")} type="email" className={inputClass} />
            <ErrorMessage errors={errors} name="email" render={({ message }) => <Err message={message} />} />
          </Field>
          <Field>
            <Label>문의 전화</Label>
            <input {...register("tel")} className={inputClass} />
          </Field>
        </div>
        <Field>
          <Label>참가비</Label>
          <input {...register("fee")} placeholder="예) 부문당 60,000원 · 무료" className={inputClass} />
        </Field>
        <Field>
          <Label>시상 내역</Label>
          <textarea {...register("prize")} rows={4} placeholder={"대상 1명 300만원\n부문별 1위 100만원 · 2위 50만원"} className={`${inputClass} h-auto py-2.5 leading-6`} />
        </Field>
      </section>

      {/* 4 포스터·확인 */}
      <section className={`rounded-2xl border border-[#E5E8EB] p-5 ${step === 3 ? "" : "hidden"}`}>
        <h2 className="mb-4 text-[16px] font-extrabold">포스터·소개</h2>
        <Field>
          <Label hint="JPG·PNG, 세로형 권장 — 목록과 홈에 포스터로 보입니다">포스터 이미지</Label>
          <div className="flex items-start gap-4">
            <button type="button" onClick={() => fileUploader.current?.click()} disabled={isUploadLoading} className="relative aspect-[3/4] w-[120px] shrink-0 overflow-hidden rounded-xl border border-dashed border-[#D1D6DB] bg-[#F7F8FA]">
              {isUploadLoading ? (
                <div className="flex h-full items-center justify-center"><Spinner className="h-6 w-6" /></div>
              ) : posterUrl ? (
                <FallbackImage src={posterUrl} alt="포스터" fill sizes="120px" className="object-cover" />
              ) : (
                <span className="flex h-full items-center justify-center text-[13px] font-semibold text-[#6B7684]">+ 포스터</span>
              )}
            </button>
            <div className="flex flex-col gap-2 text-[14px]">
              <button type="button" onClick={() => fileUploader.current?.click()} className="text-left font-semibold text-main">
                {posterUrl ? "다른 사진으로 바꾸기" : "사진 올리기"}
              </button>
              {posterUrl && (
                <button type="button" onClick={() => setValue("posterUrl", "")} className="text-left font-semibold text-[#6B7684]">
                  사진 지우기
                </button>
              )}
              <p className="text-[12px] leading-5 text-[#8B95A1]">포스터가 없으면 부문 색 바탕에 부문·연도가 대신 보입니다.</p>
            </div>
          </div>
        </Field>
        <Field>
          <Label hint="공고문·요강을 그림으로 올린 경우. 포스터와 별개로 여러 장, 20장까지">본문 이미지</Label>
          <div className="flex flex-wrap gap-2">
            {contentImages.map((url, index) => (
              <div key={url} className="relative h-24 w-[72px] overflow-hidden rounded-lg border border-[#E5E8EB]">
                <FallbackImage src={url} alt={`본문 이미지 ${index + 1}`} fill sizes="72px" className="object-cover" />
                <button type="button" onClick={() => removeContentImage(index)} aria-label="삭제" className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-[#191F28]/70 text-[11px] font-bold text-white">
                  ×
                </button>
              </div>
            ))}
            <button type="button" onClick={() => contentUploader.current?.click()} disabled={isUploadLoading || contentImages.length >= 20} className="flex h-24 w-[72px] items-center justify-center rounded-lg border border-dashed border-[#D1D6DB] bg-[#F7F8FA] text-[13px] font-semibold text-[#6B7684] disabled:opacity-40">
              + 추가
            </button>
          </div>
          <ErrorMessage errors={errors} name="contentImages" render={({ message }) => <Err message={message} />} />
        </Field>
        <Field>
          <Label>소개·안내 문구</Label>
          <textarea {...register("description")} rows={6} placeholder="대회 소개, 심사 방식, 과제곡 안내, 우편 접수 주소 등" className={`${inputClass} h-auto py-2.5 leading-6`} />
        </Field>
        <p className="rounded-xl bg-[#FFF3E0] px-4 py-3 text-[13px] leading-5 text-[#9A5B00]">이미 수집된 같은 대회가 있으면 등록 후 그 공고와 합쳐지고, 이 등록본이 대표로 보입니다.</p>
      </section>

      {submitted && errorList.length > 0 && (
        <div role="alert" className="mt-4 rounded-xl border border-[#F5C2C7] bg-[#FDECEC] px-4 py-3 text-[13px] leading-6 text-[#B42318]">
          <b className="block">아직 고쳐야 할 항목이 있어요</b>
          <ul className="mt-1 list-disc pl-4">
            {errorList.map(e => (
              <li key={e.field}>
                <button type="button" onClick={() => setStep(e.step)} className="underline underline-offset-2">
                  {e.step + 1}단계 · {e.message}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5 flex justify-between gap-3">
        <button type="button" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="h-11 rounded-[10px] border border-[#E5E8EB] px-5 text-[14px] font-bold text-[#191F28] disabled:opacity-40">
          이전
        </button>
        {step < STEPS.length - 1 ? (
          <button type="button" onClick={next} className="h-11 rounded-[10px] bg-[#191F28] px-6 text-[14px] font-bold text-white">
            다음
          </button>
        ) : (
          <button type="submit" disabled={isLoading || isUploadLoading} className="h-11 rounded-[10px] bg-main px-6 text-[14px] font-bold text-white disabled:opacity-40">
            {isLoading ? "저장 중…" : competition ? "수정 완료" : "등록 요청"}
          </button>
        )}
      </div>

      <FileUploader ref={fileUploader} uploadedFiles={handleUploadedFiles} />
      <FileUploader ref={contentUploader} uploadedFiles={handleContentFiles} multiple />
    </form>
  )
}

export default CompetitionForm
