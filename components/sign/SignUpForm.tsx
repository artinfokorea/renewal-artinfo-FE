"use client"

import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { ErrorMessage } from "@hookform/error-message"
import * as yup from "yup"
import { Button } from "../ui/button"
import useToast from "@/hooks/useToast"
import {
  checkEmailVerificationCode,
  isDuplicateEmail,
  sendEmailVerificationCode,
  signUp,
} from "@/services/auth"
import { useRouter } from "next/navigation"
import { useLoading } from "@toss/use-loading"
import InputField from "../common/InputField"
import InputWithButton from "../common/InputWithButton"
import Link from "next/link"
import { Spinner } from "../common/Loading"
import { signUpSchema } from "@/lib/schemas"

type FormData = yup.InferType<typeof signUpSchema>

const SignUpForm = () => {
  const [isPending, startTransition] = useLoading()
  const [isEmailDuplicateLoading, startEmailDuplicateTransition] = useLoading()
  const [isEmailVerifiedLoading, startEmailVerifiedTransition] = useLoading()
  const [isSendEmailVerifiedCode, setIsSendEmailVerifiedCode] = useState(false)
  const { successToast, errorToast } = useToast()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getFieldState,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(signUpSchema),
    mode: "onChange",
  })
  const router = useRouter()

  useEffect(() => {
    setValue("isEmailVerified", false)
    setIsSendEmailVerifiedCode(false)
  }, [watch("email")])

  const handleSignUp = async (payload: FormData) => {
    const { email, password, nickname, name } = payload
    try {
      await startTransition(
        signUp({
          name,
          email,
          password,
          nickname,
        }),
      )
      router.push("sign-in")
      successToast("회원가입이 완료되었습니다. 로그인 해주세요.")
    } catch (error: any) {
      errorToast(error.response.data.message)
      console.log(error.message)
    }
  }

  const isDuplicate = async () => {
    try {
      const response: { existence: boolean } =
        await startEmailDuplicateTransition(isDuplicateEmail(watch("email")))
      if (response.existence) {
        errorToast("이미 사용중인 이메일입니다.")
        return
      }
      await startEmailDuplicateTransition(
        sendEmailVerificationCode(watch("email")),
      )
      successToast(
        "사용 가능한 이메일입니다. \n이메일로 인증코드를 보냈습니다.",
      )
      setIsSendEmailVerifiedCode(true)
    } catch (error: any) {
      errorToast(error.response.data.message)
      console.log(error.message)
    }
  }

  const checkEmailVerifiedCode = async () => {
    try {
      await startEmailVerifiedTransition(
        checkEmailVerificationCode(watch("email"), watch("emailVerifiedCode")),
      )
      successToast("이메일 인증이 완료되었습니다.")
      setValue("isEmailVerified", true)
    } catch (error: any) {
      setIsSendEmailVerifiedCode(false)
      errorToast(error.response.data.message)
      console.log(error.message)
    }
  }

  return (
    <form
      className="mx-auto mt-12 max-w-[500px] px-4 md:mt-20"
      onSubmit={handleSubmit(handleSignUp)}
    >
      <Link href="/">
        <h2 className="mb-12 text-center text-4xl font-bold text-main md:mb-16">
          ARTINFO
        </h2>
      </Link>
      <InputField
        label="이름"
        id="name"
        type="text"
        register={register}
        errors={errors.name}
        placeholder="이름을 입력하세요."
        className="py-3"
      />
      <InputField
        label="닉네임"
        id="nickname"
        type="text"
        register={register}
        errors={errors.nickname}
        placeholder="닉네임을 입력하세요."
        className="py-3"
      />
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
          onClick={isDuplicate}
          disabled={
            isEmailDuplicateLoading ||
            isSendEmailVerifiedCode ||
            getFieldState("email").invalid
          }
          className="absolute right-2 top-1 h-8 rounded-lg bg-main text-white"
        >
          이메일 인증
        </Button>
      </InputWithButton>
      <ErrorMessage
        errors={errors}
        name="isEmailVerified"
        render={({ message }) => (
          <p className="text-xs font-semibold text-error">{message}</p>
        )}
      />
      <InputWithButton
        label="이메일 인증코드"
        id="emailVerifiedCode"
        type="text"
        register={register}
        errors={errors.emailVerifiedCode}
        placeholder="이메일 인증코드를 입력하세요."
        className="py-3"
      >
        <Button
          type="button"
          disabled={isEmailVerifiedLoading || watch("isEmailVerified")}
          onClick={checkEmailVerifiedCode}
          className="absolute right-2 top-1 h-8 rounded-lg bg-main text-white"
        >
          인증번호 확인
        </Button>
      </InputWithButton>
      <InputField
        label="비밀번호"
        id="password"
        type="password"
        register={register}
        errors={errors.password}
        placeholder="비밀번호를 입력하세요."
        className="py-3"
      />
      <InputField
        label="비밀번호 확인"
        id="rePassword"
        type="password"
        register={register}
        errors={errors.rePassword}
        placeholder="비밀번호를 입력하세요."
        className="py-3"
      />
      <Button
        type="submit"
        className="my-4 w-full bg-main text-white hover:bg-main"
        disabled={isPending}
      >
        {isPending ? <Spinner className="h-5 w-5" /> : "회원가입"}
      </Button>
    </form>
  )
}

export default SignUpForm
