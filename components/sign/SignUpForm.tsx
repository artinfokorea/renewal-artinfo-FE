"use client"

import React, { useEffect, useMemo, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { ErrorMessage } from "@hookform/error-message"
import * as yup from "yup"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import useToast from "@/hooks/useToast"
import {
  checkEmailVerificationCode,
  isDuplicateEmail,
  sendEmailVerificationCode,
  signUp,
} from "@/apis/auth"
import { useRouter } from "next/navigation"
import { useLoading } from "@toss/use-loading"
import InputField from "../common/InputField"
import InputWithButton from "../common/InputWithButton"
import Link from "next/link"

const schema = yup
  .object({
    email: yup
      .string()
      .email("이메일 형식이 아닙니다.")
      .required("이메일을 입력해주세요."),
    password: yup
      .string()
      .min(8, "8자 이상 12자 이하로 영문, 숫자, 특수문자를 포함해주세요.")
      .max(12, "8자 이상 12자 이하로 영문, 숫자, 특수문자를 포함해주세요.")
      .required()
      .matches(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,12}$/,
        "8자 이상 12자 이하로 영문, 숫자, 특수문자를 포함해주세요.",
      ),
    rePassword: yup
      .string()
      .required("재확인 비밀번호를 입력해주세요.")
      .oneOf([yup.ref("password")], "재확인 비밀번호가 일치 하지 않습니다."),
    name: yup
      .string()
      .min(2, "이름은 2글자 이상 입력해주세요.")
      .max(6, "이름은 6글자 이하로 입력해주세요.")
      .required("이름을 입력해주세요."),
    nickname: yup
      .string()
      .min(2, "닉네임은 2글자 이상 입력해주세요.")
      .max(6, "닉네임은 12글자 이하로 입력해주세요.")
      .required("닉네임을 입력해주세요."),
    isEmailVerified: yup
      .boolean()
      .oneOf([true], "이메일 중복검사를 완료해주세요.")
      .default(false),
  })
  .required()

type FormData = yup.InferType<typeof schema>

const SignUpForm = () => {
  const [isPending, startTransition] = useLoading()
  const [isEmailDuplicateLoading, startEmailDuplicateTransition] = useLoading()
  const [isEmailVerifiedLoading, startEmailVerifiedTransition] = useLoading()
  const [isSendEmailVerifiedCode, setIsSendEmailVerifiedCode] = useState(false)
  const [emailVerifiedCode, setEmailVerifiedCode] = useState("")
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const { successToast, errorToast } = useToast()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    getFieldState,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  })
  const router = useRouter()

  useEffect(() => {
    clearErrors("isEmailVerified")
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
      errorToast(error.message)
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
      successToast("사용 가능한 이메일입니다.")
      setIsSendEmailVerifiedCode(true)
    } catch (error: any) {
      errorToast(error.message)
      console.log(error.message)
    }
  }

  const checkEmailVerifiedCode = async () => {
    try {
      await startEmailVerifiedTransition(
        checkEmailVerificationCode(watch("email"), emailVerifiedCode),
      )
      successToast("이메일 인증이 완료되었습니다.")
      setValue("isEmailVerified", true)
      setIsEmailVerified(true)
    } catch (error: any) {
      errorToast(error.message)
      console.log(error.message)
    }
  }

  const emailIsValid = useMemo(() => {
    const emailRegex = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
    return emailRegex.test(watch("email"))
  }, [watch("email")])

  return (
    <form
      className="max-w-[500px] mx-auto mt-12 md:mt-20 px-4"
      onSubmit={handleSubmit(handleSignUp)}
    >
      <Link href="/">
        <h2 className="text-4xl font-bold text-main text-center mb-12 md:mb-16">
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
          disabled={!emailIsValid || isEmailDuplicateLoading}
          className="absolute top-1 right-2 bg-main text-white rounded-lg h-8"
        >
          이메일 인증
        </Button>
      </InputWithButton>
      <ErrorMessage
        errors={errors}
        name="isEmailVerified"
        render={({ message }) => (
          <p className="text-error text-xs font-semibold">{message}</p>
        )}
      />

      {isSendEmailVerifiedCode && (
        <InputWithButton
          label="이메일 인증코드"
          id="isEmailVerified"
          type="text"
          register={register}
          errors={errors.isEmailVerified}
          placeholder="이메일 인증코드를 입력하세요."
          className="py-3"
        >
          <Button
            type="button"
            disabled={isEmailVerifiedLoading || isEmailVerified}
            onClick={checkEmailVerifiedCode}
            className="absolute top-1 right-2 bg-main text-white rounded-lg h-8"
          >
            인증번호 확인
          </Button>
        </InputWithButton>
      )}
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
        className="bg-main w-full my-4 hover:bg-main text-white"
        disabled={isPending}
      >
        회원가입
      </Button>
    </form>
  )
}

export default SignUpForm
