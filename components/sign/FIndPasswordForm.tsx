"use client"

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { useEffect, useState } from "react"
import InputField from "../common/InputField"
import InputWithButton from "../common/InputWithButton"
import Link from "next/link"
import { findPasswordSchema } from "@/lib/schemas"
import { isDuplicateEmail } from "@/apis/auth"

export type PasswordFormData = yup.InferType<typeof findPasswordSchema>

interface Props {
  isLoading: boolean
  sendCode: (email: string) => Promise<void>
  checkCode: (email: string, code: string) => Promise<void>
  handlePassword: (payload: PasswordFormData) => void
}

const FindPasswordForm = ({
  isLoading,
  sendCode,
  checkCode,
  handlePassword,
}: Props) => {
  const [isSendEmail, setIsSendEmail] = useState(false)
  const [verifyCode, setVerifyCode] = useState("")
  const [isVerify, setIsVerify] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    getFieldState,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: yupResolver(findPasswordSchema),
    mode: "onChange",
  })

  useEffect(() => {
    setIsVerify(false)
    setIsSendEmail(false)
  }, [watch("email")])

  const sendEmail = async () => {
    try {
      setIsVerify(false)
      await isDuplicateEmail(getValues("email"))
      await sendCode(getValues("email"))
      setIsSendEmail(true)
    } catch (error) {
      console.error("이메일 인증 코드 전송 실패:", error)
    }
  }
  const checkEmail = async () => {
    try {
      setIsSendEmail(false)
      await checkCode(getValues("email") as string, verifyCode)
      setIsVerify(true)
      setValue("isEmailVerified", true)
    } catch (error) {
      console.error("이메일 인증 코드 확인 실패:", error)
    }
  }

  return (
    <form className="max-w-[500px] mx-auto mt-12 md:mt-20 px-4">
      <Link href="/">
        <h2 className="text-4xl font-bold text-main text-center mb-12 md:mb-16">
          ARTINFO
        </h2>
      </Link>
      <InputWithButton
        label="이메일"
        id="email"
        type="email"
        register={register}
        errors={errors.email}
        placeholder="이메일을 입력하세요."
        className="py-3"
      >
        <Button
          type="button"
          onClick={sendEmail}
          disabled={isSendEmail || getFieldState("email").invalid}
          className="absolute top-1 right-2 bg-main text-white rounded-lg h-8"
        >
          인증코드 전송
        </Button>
      </InputWithButton>
      <div className="flex flex-col gap-2 my-2">
        <Label
          htmlFor="이메일 인증 코드"
          className="block pb-1 text-sm font-semibold text-tertiary"
        >
          이메일 인증 코드
        </Label>
        <div className="relative">
          <input
            value={verifyCode}
            onChange={e => setVerifyCode(e.target.value)}
            type="text"
            placeholder="인증 코드를 입력해주세요."
            className="w-full rounded border px-2 py-3 text-xs leading-tight text-black"
          />
          <Button
            type="button"
            disabled={verifyCode.length !== 6 || isVerify}
            onClick={checkEmail}
            className="text-white bg-main absolute top-1 right-2 h-8"
          >
            인증
          </Button>
        </div>
      </div>
      <InputField
        label="패스워드"
        id="password"
        type="password"
        register={register}
        errors={errors.password}
        placeholder="비밀번호를 입력해주세요."
        className="py-3"
      />
      <InputField
        label="패스워드 확인"
        id="rePassword"
        type="password"
        register={register}
        errors={errors.rePassword}
        placeholder="비밀번호를 입력해주세요."
        className="py-3"
      />
      <div className="flex justify-center gap-4 mt-4">
        <Button
          type="button"
          disabled={isLoading}
          onClick={handleSubmit(handlePassword)}
          className="text-white rounded-lg text-sm bg-main w-full"
        >
          비밀번호 변경
        </Button>
      </div>
    </form>
  )
}

export default FindPasswordForm
