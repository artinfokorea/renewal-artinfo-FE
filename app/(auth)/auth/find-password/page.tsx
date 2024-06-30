"use client"

import {
  checkEmailVerificationCode,
  isDuplicateEmail,
  sendEmailVerificationCode,
} from "@/apis/auth"
import { updateUserPassword } from "@/apis/users"
import FindPasswordForm, {
  PasswordFormData,
} from "@/components/sign/FIndPasswordForm"
import useToast from "@/hooks/useToast"
import { useLoading } from "@toss/use-loading"

const page = () => {
  const { successToast, errorToast } = useToast()
  const [isUpdatePasswordLoading, updatePasswordStartTransition] = useLoading()

  const sendEmailVerifyCode = async (email: string) => {
    try {
      const response: { existence: boolean } = await isDuplicateEmail(email)
      if (response.existence) {
        await sendEmailVerificationCode(email)
      } else if (!response.existence) {
        errorToast("존재하지 않는 이메일입니다.")
        return
      }

      successToast("인증코드가 전송되었습니다.")
    } catch (error: any) {
      errorToast(error.message)
      console.log(error.message)
    }
  }

  const checkEmailVerifyCode = async (email: string, verification: string) => {
    try {
      await checkEmailVerificationCode(email, verification)
      successToast("이메일 인증이 완료되었습니다.")
    } catch (error: any) {
      errorToast(error.message)
      console.log(error)
    }
  }

  const handleUserPassword = async (payload: PasswordFormData) => {
    try {
      await updatePasswordStartTransition(
        updateUserPassword(payload.password, payload.email),
      )
      successToast("비밀번호 변경이 완료되었습니다.")
    } catch (error: any) {
      errorToast(error.message)
      console.log(error)
    }
  }

  return (
    <FindPasswordForm
      isLoading={isUpdatePasswordLoading}
      sendCode={sendEmailVerifyCode}
      checkCode={checkEmailVerifyCode}
      handlePassword={handleUserPassword}
    />
  )
}

export default page
