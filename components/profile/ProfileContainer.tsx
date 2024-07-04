"use client"

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import React, { useEffect, useState } from "react"
import { useLoading } from "@toss/use-loading"
import {
  sendPhoneVerificationCode,
  uploadImages,
  verifyPhoneCode,
} from "@/apis/system"
import useToast from "@/hooks/useToast"
import { updateUser, updateUserPassword, updateUserPhone } from "@/apis/users"
import { SchoolType } from "@/types/lessons"
import {
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { queries } from "@/lib/queries"
import MajorDialog from "@/components/dialog/MajorDialog"
import PhoneDialog from "@/components/dialog/PhoneDialog"
import ProfileForm from "@/components/profile/ProfileForm"
import filters from "@/lib/filters"
import PasswordDialog, {
  PasswordFormData,
} from "@/components/dialog/PasswordDialog"
import {
  sendEmailVerificationCode,
  checkEmailVerificationCode,
} from "@/apis/auth"
import { MAJOR } from "@/types/majors"
import { profileSchema } from "@/lib/schemas"

export type ProfileFormData = yup.InferType<typeof profileSchema>

const ProfileContainer = () => {
  const [isMajorDialog, setIsMajorDialog] = useState(false)
  const [isImageUploadLoading, imageStartTransition] = useLoading()
  const { successToast, errorToast } = useToast()
  const [isUpdateForm, setIsUpdateForm] = useState(false)
  const [isUpdateProfileLoading, updateProfileStartTransition] = useLoading()
  const [isUpdatePhoneLoading, updatePhoneStartTransition] = useLoading()
  const [isUpdatePasswordLoading, updatePasswordStartTransition] = useLoading()
  const [isPhoneDialog, setIsPhoneDialog] = useState(false)
  const [isPasswordDialog, setIsPasswordDialog] = useState(false)
  const queryClient = useQueryClient()
  const filter = filters()

  const { data: user } = useSuspenseQuery({
    ...queries.users.detail(),
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
  })

  useEffect(() => {
    if (user) {
      const birthDate = filter.YYYYMMDD(user?.birth, "YYYY-MM-DD")
      if (birthDate) setValue("birth", birthDate)
      setValue("majors", user?.majors)
      setValue(
        "bachellor",
        user?.schools?.filter(item => item.type === SchoolType.UNDERGRADUATE)[0]
          ?.name,
      )
      setValue(
        "master",
        user?.schools?.filter(item => item.type === SchoolType.MASTER)[0]?.name,
      )
      setValue(
        "doctor",
        user?.schools?.filter(item => item.type === SchoolType.DOCTOR)[0]?.name,
      )
      setValue("imageUrl", user?.iconImageUrl)
      setValue("nickname", user?.nickname || "")
      setValue("name", user?.name)
      setValue("phone", user?.phone)
    }
  }, [user])

  const handleUploadedFiles = async (files: File[]) => {
    try {
      const uploadResponse = await imageStartTransition(
        uploadImages(files as File[]),
      )
      successToast("프로필 이미지가 등록되었습니다.")
      setValue("imageUrl", uploadResponse.images[0].url as string)
    } catch (error: any) {
      errorToast(error.message)
      console.log(error)
    }
  }

  const handleSelectMajor = (selectedMajor: MAJOR) => {
    const majorIds = watch("majors")?.map(major => major.id)

    if (majorIds?.includes(selectedMajor.id)) {
      setValue(
        "majors",
        watch("majors")?.filter(major => major.id !== selectedMajor.id),
        {
          shouldDirty: true,
        },
      )
    } else {
      const currentMajors = watch("majors") || []
      setValue("majors", [...currentMajors, selectedMajor], {
        shouldDirty: true,
      })
    }
  }

  const updateProfile = async (payload: ProfileFormData) => {
    const {
      bachellor,
      master,
      doctor,
      birth,
      imageUrl,
      majors,
      nickname,
      name,
    } = payload

    const schools = []
    if (bachellor)
      schools.push({ type: SchoolType.UNDERGRADUATE, name: payload.bachellor })
    if (master) schools.push({ type: SchoolType.MASTER, name: payload.master })
    if (doctor) schools.push({ type: SchoolType.DOCTOR, name: payload.doctor })

    const request = {
      birth,
      nickname,
      iconImageUrl: imageUrl || undefined,
      majorIds: majors?.map(major => major.id),
      name,
      schools:
        schools.length > 0
          ? schools.map(school => ({
              type: school.type,
              name: school.name || "",
            }))
          : undefined,
    }

    try {
      await updateProfileStartTransition(updateUser(request))
      successToast("프로필이 수정되었습니다.")
      await queryClient.invalidateQueries({
        queryKey: queries.users.detail().queryKey,
      })
      setIsUpdateForm(false)
    } catch (error: any) {
      errorToast(error.message)
      console.log(error)
    }
  }

  const sendPhoneCode = async (phone: string) => {
    try {
      await sendPhoneVerificationCode(phone)
      successToast("인증번호가 발송되었습니다.")
    } catch (error: any) {
      errorToast(error.message)
      console.log(error)
    }
  }

  const checkPhoneVerificationCode = async (
    phone: string,
    verification: string,
  ) => {
    try {
      await updatePhoneStartTransition(verifyPhoneCode({ phone, verification }))
      await updateUserPhone(phone)
      await queryClient.invalidateQueries({
        queryKey: queries.users.detail().queryKey,
      })
      successToast("휴대폰 인증이 완료되었습니다.")
      setIsPhoneDialog(!isPhoneDialog)
    } catch (error: any) {
      errorToast(error.message)
      console.log(error)
    }
  }

  const handleUserPassword = async (payload: PasswordFormData) => {
    try {
      await updatePasswordStartTransition(
        updateUserPassword(payload.password, user?.email as string),
      )
      successToast("비밀번호 변경이 완료되었습니다.")
      setIsPasswordDialog(!isPasswordDialog)
    } catch (error: any) {
      errorToast(error.response.data.message)
      console.log(error)
    }
  }

  const sendEmailVerifyCode = async () => {
    try {
      await sendEmailVerificationCode(user?.email)
      successToast("인증코드가 전송되었습니다.")
    } catch (error: any) {
      console.log("error", error)
      errorToast("인증코드 전송에 실패했습니다.")
      console.log(error)
      throw error
    }
  }

  const checkEmailVerifyCode = async (verification: string) => {
    try {
      await checkEmailVerificationCode(user?.email, verification)
      successToast("이메일 인증이 완료되었습니다.")
    } catch (error: any) {
      if (error.response.data.code === "VERIFICATION-001") {
        errorToast(error.response.data.message)
      } else {
        errorToast("이메일 인증에 실패했습니다.")
      }
      console.error(error)
      throw error
    }
  }

  return (
    <section className="max-w-screen-lg mx-auto">
      {user && (
        <ProfileForm
          user={user}
          isUpdateForm={isUpdateForm}
          isUpdateProfileLoading={isUpdateProfileLoading}
          isImageUploadLoading={isImageUploadLoading}
          handleUploadedFiles={handleUploadedFiles}
          handleSelectMajor={handleSelectMajor}
          handleMajorDialog={() => setIsMajorDialog(!isMajorDialog)}
          handlePhoneDialog={() => setIsPhoneDialog(!isPhoneDialog)}
          handleUpdateForm={() => setIsUpdateForm(!isUpdateForm)}
          handlePasswordDialog={() => setIsPasswordDialog(!isPasswordDialog)}
          isDirty={isDirty}
          setValue={setValue}
          errors={errors}
          register={register}
          handleSubmit={handleSubmit(updateProfile)}
          watch={watch}
        />
      )}
      <MajorDialog
        open={isMajorDialog}
        close={() => setIsMajorDialog(!isMajorDialog)}
        selectedMajors={watch("majors") || []}
        handleSelectMajor={handleSelectMajor}
        multiple={true}
      />
      <PhoneDialog
        open={isPhoneDialog}
        close={() => setIsPhoneDialog(!isPhoneDialog)}
        sendCode={sendPhoneCode}
        checkCode={checkPhoneVerificationCode}
        isLoading={isUpdatePhoneLoading}
      />
      <PasswordDialog
        open={isPasswordDialog}
        close={() => setIsPasswordDialog(!isPasswordDialog)}
        isLoading={isUpdatePasswordLoading}
        handlePassword={handleUserPassword}
        sendEmailVerifyCode={sendEmailVerifyCode}
        checkEmailVerifyCode={checkEmailVerifyCode}
      />
    </section>
  )
}

export default ProfileContainer
