"use client"

import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Button } from "../ui/button"
import Link from "next/link"
import { signIn } from "next-auth/react"
import useToast from "@/hooks/useToast"
import { useLoading } from "@toss/use-loading"
import { useSearchParams } from "next/navigation"
import InputField from "../common/InputField"
import AlertDialog from "../dialog/AlertDialog"

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
  })
  .required()

type FormData = yup.InferType<typeof schema>

const SignInForm = () => {
  const [isLoading, startTransition] = useLoading()
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const { errorToast } = useToast()
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  const handleDialog = () => setIsConfirmDialogOpen(!isConfirmDialogOpen)

  useEffect(() => {
    if (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }, [error])

  const getErrorMessage = (errorType: string) => {
    switch (errorType) {
      case "CredentialsSignin":
        return "이메일 또는 비밀번호가 잘못되었습니다."
      case "OAuthSignin":
        return "소셜 로그인 중 오류가 발생했습니다."

      default:
        return "로그인 중 오류가 발생했습니다."
    }
  }

  const handleSignIn = async (payload: FormData) => {
    try {
      setErrorMessage("")
      await startTransition(
        signIn("signin-email", {
          ...payload,
          callbackUrl: "/",
        }),
      )
    } catch (error: any) {
      errorToast(error.message)
      console.log(error)
      setIsConfirmDialogOpen(true)
    }
  }

  const kakaoInit = () => {
    const kakao = (window as any).Kakao
    if (!kakao.isInitialized()) {
      kakao.init(process.env.NEXT_PUBLIC_KAKAO_API_KEY)
    }

    return kakao
  }

  const kakaoLogin = async () => {
    const kakao = kakaoInit()

    kakao.Auth.authorize({
      redirectUri: `${process.env.NEXT_PUBLIC_REDIRECT_URL}auth/callback`,
      state: "kakao",
      prompts: "login",
    })
  }

  const handleNaverLogin = () => {
    const NaverIdLogin = (window as any).naver
    const naverLogin = new NaverIdLogin.LoginWithNaverId({
      clientId: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
      callbackUrl: `${process.env.NEXT_PUBLIC_REDIRECT_URL}auth/callback?state=naver`,
      state: "naver",
      callbackHandle: true,
    })
    naverLogin.init()
    naverLogin.reprompt()
  }

  const handleGoogleLogin = () => {
    let url = "https://accounts.google.com/o/oauth2/v2/auth"
    url += `?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`
    url += `&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URL}auth/callback`
    url += "&prompt=consent"
    url += "&scope=email"
    url += "&state=google"
    url += "&response_type=token"
    url += "&include_granted_scopes=true"
    window.open(url, "_self")
  }

  return (
    <form
      className="max-w-[500px] mx-auto mt-12 md:mt-28 px-4"
      onSubmit={handleSubmit(handleSignIn)}
    >
      <Link href="/">
        <h2 className="text-4xl font-bold text-main text-center mb-12 md:mb-16">
          ARTINFO
        </h2>
      </Link>
      <InputField
        label="이메일"
        id="email"
        type="email"
        register={register}
        errors={errors.email}
        placeholder="이메일을 입력하세요."
        className="py-3"
      />
      <InputField
        label="비밀번호"
        id="password"
        type="password"
        register={register}
        errors={errors.password}
        placeholder="비밀번호를 입력하세요."
        className="py-3"
      />
      {errorMessage && <p className="text-xs text-error">{errorMessage}</p>}
      <Button
        type="submit"
        className="bg-main w-full my-6 hover:bg-main text-white"
        disabled={isLoading}
      >
        로그인
      </Button>
      <p className="text-primary text-center mt-2">
        아직 회원이 아니신가요?
        <Link href="/auth/sign-up">
          <span className="text-main cursor-pointer"> 회원가입</span>
        </Link>
      </p>
      <Link href="/auth/find-password" prefetch={false}>
        <p className="text-center text-main">비밀번호 찾기</p>
      </Link>
      <div className="flex text-grey mt-4">
        <div className="border-b-2 w-full border-grey mb-3" />
        <span className="whitespace-nowrap mx-4 font-semibold">간편로그인</span>
        <div className="border-b-2 w-full border-grey mb-3" />
      </div>
      <div className="flex justify-between w-[200px] mx-auto mt-6">
        <Button
          type="button"
          className="p-1 bg-white w-[48px] h-[48px] rounded-lg transition ease-in-out duration-150 inline-flex items-center justify-center  text-white shadow-md  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 "
          disabled={isLoading}
          onClick={handleGoogleLogin}
        >
          <img src="/google_logo.png" alt="google_logo" />
        </Button>
        <button
          type="button"
          className="w-[48px] h-[48px] rounded-lg transition ease-in-out duration-150 inline-flex items-center justify-center  text-white shadow-md  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 "
          disabled={isLoading}
          onClick={handleNaverLogin}
        >
          <img src="/naver_logo.png" alt="naver_logo" />
        </button>
        <button
          type="button"
          className="w-[48px] h-[48px] rounded-lg transition ease-in-out duration-150 inline-flex items-center justify-center bg-[#FEE500]  text-white shadow-md  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 "
          disabled={isLoading}
          onClick={kakaoLogin}
        >
          <img src="/kakao_logo.png" alt="kakao_logo" />
        </button>
      </div>
      <AlertDialog
        title="로그인 실패"
        description="이메일 또는 비밀번호가 일치하지 않습니다."
        error
        isOpen={isConfirmDialogOpen}
        handleDialog={handleDialog}
      />
    </form>
  )
}

export default SignInForm
