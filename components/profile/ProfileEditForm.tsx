"use client"

import React, { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { ErrorMessage } from "@hookform/error-message"
import { useLoading } from "@toss/use-loading"
import { Camera, Plus, X } from "lucide-react"
import * as yup from "yup"
import FallbackImage from "../common/FallbackImage"
import FileUploader from "../common/FileUploader"
import { Spinner } from "../common/Loading"
import MajorDialog from "../dialog/MajorDialog"
import useToast from "@/hooks/useToast"
import filters from "@/lib/filters"
import { profileSchema } from "@/lib/schemas"
import { uploadImages } from "@/services/system"
import { UploadTarget } from "@/types"
import { SchoolType } from "@/types/lessons"
import { MAJOR } from "@/types/majors"
import { USER } from "@/types/users"

export type ProfileFormData = yup.InferType<typeof profileSchema>

interface Props {
  user?: USER
  isSubmitting: boolean
  onCancel: () => void
  onSubmit: (payload: ProfileFormData) => void
}

const SCHOOLS: { key: "bachellor" | "master" | "doctor"; label: string; placeholder: string }[] = [
  { key: "bachellor", label: "학사", placeholder: "대학교" },
  { key: "master", label: "석사", placeholder: "대학원" },
  { key: "doctor", label: "박사", placeholder: "대학원" },
]

const schoolName = (user: USER | undefined, type: SchoolType) =>
  user?.schools?.find(school => school.type === type)?.name

const inputClass =
  "w-full bg-transparent text-right text-base text-[#191F28] placeholder:text-[#9ca3af] focus:outline-none"

/** 라벨 왼쪽 + 입력 오른쪽으로 된 한 줄 편집 행 */
const EditRow = ({
  label,
  children,
  error,
}: {
  label: string
  children: React.ReactNode
  error?: React.ReactNode
}) => (
  <div className="flex min-h-[52px] flex-col justify-center gap-1 px-4 py-2.5">
    <div className="flex items-center gap-3">
      <span className="w-[72px] flex-none text-[15px] font-medium text-[#191F28]">{label}</span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
    {error}
  </div>
)

const FieldError = ({ message }: { message: string }) => (
  <p className="text-xs font-medium text-error">{message}</p>
)

/**
 * 프로필 수정 — 조회 화면과 같은 카드 구조에서 바로 고친다 (앱 ProfileEditForm 과 동일 구성).
 * 사진·이름·닉네임은 상단 카드, 생년월일·전공·학력은 아래 그룹, 저장은 하단 버튼 하나.
 */
const ProfileEditForm = ({ user, isSubmitting, onCancel, onSubmit }: Props) => {
  const fileUploader = useRef<HTMLInputElement>(null)
  const filter = filters()
  const { successToast, errorToast } = useToast()
  const [isMajorDialog, setIsMajorDialog] = useState(false)
  const [isUploadLoading, uploadTransition] = useLoading()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({ resolver: yupResolver(profileSchema) })

  useEffect(() => {
    if (!user) return
    reset({
      birth: filter.YYYYMMDD(user.birth, "YYYY-MM-DD") ?? "",
      majors: user.majors ?? [],
      bachellor: schoolName(user, SchoolType.UNDERGRADUATE) ?? "",
      master: schoolName(user, SchoolType.MASTER) ?? "",
      doctor: schoolName(user, SchoolType.DOCTOR) ?? "",
      imageUrl: user.iconImageUrl ?? "",
      nickname: user.nickname ?? "",
      name: user.name ?? "",
      phone: user.phone ?? "",
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, reset])

  const majors = (watch("majors") ?? []) as MAJOR[]
  const imageUrl = watch("imageUrl")

  const toggleMajor = (selected: MAJOR) => {
    const next = majors.some(major => major.id === selected.id)
      ? majors.filter(major => major.id !== selected.id)
      : [...majors, selected]
    setValue("majors", next, { shouldDirty: true, shouldValidate: true })
  }

  const handleUploadedFiles = async (files: File[]) => {
    try {
      const uploadResponse = await uploadTransition(uploadImages(UploadTarget.USER, files, true))
      setValue("imageUrl", uploadResponse.images[0].url as string, { shouldDirty: true })
      successToast("새 사진을 올렸습니다. 저장을 눌러주세요.")
    } catch (error: any) {
      errorToast(error.message)
    }
  }

  const cancel = () => {
    if (isDirty && !window.confirm("바꾼 내용이 저장되지 않습니다. 수정을 취소할까요?")) return
    onCancel()
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto flex w-full max-w-xl flex-col gap-6"
    >
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg font-bold text-[#191F28]">프로필 수정</h2>
        <button type="button" onClick={cancel} className="text-[15px] text-[#4E5968] hover:text-[#191F28]">
          취소
        </button>
      </div>

      {/* 사진·이름·닉네임 */}
      <div className="overflow-hidden rounded-2xl border border-[#E5E8EB] bg-white">
        <div className="flex items-center gap-4 p-4">
          <button
            type="button"
            onClick={() => fileUploader.current?.click()}
            disabled={isUploadLoading}
            className="relative h-16 w-16 flex-none"
            aria-label="프로필 사진 변경"
          >
            <div className="relative h-16 w-16 overflow-hidden rounded-full bg-[#F2F4F6]">
              {isUploadLoading ? (
                <div className="flex h-full w-full items-center justify-center">
                  <Spinner className="h-6 w-6" />
                </div>
              ) : (
                <FallbackImage src={imageUrl || ""} alt="user_profile_image" fill sizes="64px" className="object-cover" />
              )}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-main">
              <Camera className="h-3 w-3 text-white" />
            </span>
          </button>
          <div className="flex flex-col items-start gap-1.5">
            <button
              type="button"
              onClick={() => fileUploader.current?.click()}
              disabled={isUploadLoading}
              className="text-sm font-semibold text-main"
            >
              사진 바꾸기
            </button>
            {imageUrl && (
              <button
                type="button"
                onClick={() => setValue("imageUrl", "", { shouldDirty: true })}
                className="text-sm font-semibold text-[#6B7684]"
              >
                사진 지우기
              </button>
            )}
          </div>
        </div>
        <div className="ml-4 h-px bg-[#E5E8EB]" />
        <EditRow
          label="이름"
          error={<ErrorMessage errors={errors} name="name" render={({ message }) => <FieldError message={message} />} />}
        >
          <input {...register("name")} placeholder="이름" className={inputClass} />
        </EditRow>
        <div className="ml-4 h-px bg-[#E5E8EB]" />
        <EditRow
          label="닉네임"
          error={<ErrorMessage errors={errors} name="nickname" render={({ message }) => <FieldError message={message} />} />}
        >
          <input {...register("nickname")} placeholder="닉네임" autoCapitalize="none" className={inputClass} />
        </EditRow>
      </div>

      {/* 생년월일·전공 */}
      <section className="flex flex-col gap-2">
        <h3 className="px-1 text-[13px] font-semibold text-[#6B7684]">기본 정보</h3>
        <div className="overflow-hidden rounded-2xl border border-[#E5E8EB] bg-white">
          <EditRow
            label="생년월일"
            error={<ErrorMessage errors={errors} name="birth" render={({ message }) => <FieldError message={message} />} />}
          >
            <input {...register("birth")} type="date" className={inputClass} />
          </EditRow>
          <div className="ml-4 h-px bg-[#E5E8EB]" />
          <div className="flex flex-col gap-2.5 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="w-[72px] flex-none text-[15px] font-medium text-[#191F28]">전공</span>
              <button
                type="button"
                onClick={() => setIsMajorDialog(true)}
                className="ml-auto flex items-center gap-1 text-sm font-semibold text-main"
              >
                <Plus className="h-3 w-3" strokeWidth={3} />
                {majors.length ? "바꾸기" : "전공 선택"}
              </button>
            </div>
            {majors.length > 0 && (
              <ul className="flex flex-wrap gap-1.5">
                {majors.map(major => (
                  <li key={major.id}>
                    <button
                      type="button"
                      onClick={() => toggleMajor(major)}
                      className="flex items-center gap-1 rounded-full bg-[#E8F3FF] px-2.5 py-1 text-xs font-semibold text-[#1B64DA]"
                    >
                      {major.koName}
                      <X className="h-2.5 w-2.5" strokeWidth={3} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <ErrorMessage errors={errors} name="majors" render={({ message }) => <FieldError message={message} />} />
          </div>
        </div>
        <p className="px-1 text-xs leading-[17px] text-[#6B7684]">전공은 2개까지 고를 수 있어요. 뱃지를 누르면 빠집니다.</p>
      </section>

      {/* 학력 */}
      <section className="flex flex-col gap-2">
        <h3 className="px-1 text-[13px] font-semibold text-[#6B7684]">학력</h3>
        <div className="overflow-hidden rounded-2xl border border-[#E5E8EB] bg-white">
          {SCHOOLS.map((school, index) => (
            <React.Fragment key={school.key}>
              {index > 0 && <div className="ml-4 h-px bg-[#E5E8EB]" />}
              <EditRow label={school.label}>
                <input {...register(school.key)} placeholder={school.placeholder} className={inputClass} />
              </EditRow>
            </React.Fragment>
          ))}
        </div>
        <p className="px-1 text-xs leading-[17px] text-[#6B7684]">해당 없는 칸은 비워 두면 됩니다.</p>
      </section>

      <button
        type="submit"
        disabled={!isDirty || isSubmitting || isUploadLoading}
        className="h-12 w-full rounded-xl bg-main text-base font-semibold text-white transition-opacity disabled:opacity-40"
      >
        {isSubmitting ? "저장 중…" : "저장"}
      </button>

      <FileUploader ref={fileUploader} uploadedFiles={handleUploadedFiles} />
      <MajorDialog
        open={isMajorDialog}
        close={() => setIsMajorDialog(false)}
        selectedMajors={majors}
        handleSelectMajor={toggleMajor}
        multiple
      />
    </form>
  )
}

export default ProfileEditForm
