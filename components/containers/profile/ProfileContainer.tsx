"use client"

import React, { useState } from "react"
import { useLoading } from "@toss/use-loading"
import { sendPhoneVerificationCode, verifyPhoneCode } from "@/services/system"
import useToast from "@/hooks/useToast"
import {
  updateUser,
  updateUserPassword,
  updateUserPhone,
} from "@/services/users"
import { SchoolType } from "@/types/lessons"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { queries } from "@/lib/queries"
import PhoneDialog from "@/components/dialog/PhoneDialog"
import ProfileForm, {
  ProfileFormData,
} from "@/components/form/user/ProfileForm"
import PasswordDialog, {
  PasswordFormData,
} from "@/components/dialog/PasswordDialog"
import {
  sendEmailVerificationCode,
  checkEmailVerificationCode,
} from "@/services/auth"

const ProfileContainer = () => {
  const [isUpdateForm, setIsUpdateForm] = useState(false)
  const [isUpdateProfileLoading, updateProfileStartTransition] = useLoading()
  const [isUpdatePhoneLoading, updatePhoneStartTransition] = useLoading()
  const [isUpdatePasswordLoading, updatePasswordStartTransition] = useLoading()
  const [isPhoneDialog, setIsPhoneDialog] = useState(false)
  const [isPasswordDialog, setIsPasswordDialog] = useState(false)
  const queryClient = useQueryClient()
  const { successToast, errorToast } = useToast()

  const { data: user } = useQuery({
    ...queries.users.detail(),
  })

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
      await sendEmailVerificationCode(user?.email as string)
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
      await checkEmailVerificationCode(user?.email as string, verification)
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
    <section className="mx-auto max-w-screen-lg">
      <ProfileForm
        user={user}
        isUpdateForm={isUpdateForm}
        isUpdateProfileLoading={isUpdateProfileLoading}
        handlePhoneDialog={() => setIsPhoneDialog(!isPhoneDialog)}
        handleUpdateForm={() => setIsUpdateForm(!isUpdateForm)}
        handlePasswordDialog={() => setIsPasswordDialog(!isPasswordDialog)}
        handleProfile={(payload: ProfileFormData) => updateProfile(payload)}
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
