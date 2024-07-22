"use client"

import {
  checkEmailVerificationCode,
  isDuplicateEmail,
  sendEmailVerificationCode,
} from "@/services/auth"
import { updateUserPassword } from "@/services/users"
import FindPasswordForm, {
  PasswordFormData,
} from "@/components/form/user/FIndPasswordForm"
import useToast from "@/hooks/useToast"
import { useLoading } from "@toss/use-loading"
import { useRouter } from "next/navigation"

const page = () => {
  const { successToast, errorToast } = useToast()
  const [isUpdatePasswordLoading, updatePasswordStartTransition] = useLoading()
  const router = useRouter()

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
      console.log("error", error)
      errorToast("인증코드 전송에 실패했습니다.")
      console.log(error)
      throw error
    }
  }

  const checkEmailVerifyCode = async (email: string, verification: string) => {
    try {
      await checkEmailVerificationCode(email, verification)
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

  const handleUserPassword = async (payload: PasswordFormData) => {
    try {
      await updatePasswordStartTransition(
        updateUserPassword(payload.password, payload.email),
      )
      successToast("비밀번호 변경이 완료되었습니다.")
      router.push("/auth/sign-in")
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
