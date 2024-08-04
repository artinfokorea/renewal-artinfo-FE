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
import { Spinner } from "../common/Loading"
import { signInSchema } from "@/lib/schemas"
import Cookies from "js-cookie"

type FormData = yup.InferType<typeof signInSchema>

const SignInForm = () => {
  const [isLoading, startTransition] = useLoading()
  const [errorMessage, setErrorMessage] = useState("")
  const { errorToast } = useToast()
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const prevPath = Cookies.get("prevPath")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(signInSchema),
  })

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
    let callbackUrl = prevPath || "/"
    if (prevPath) Cookies.remove("prevPath")

    try {
      await startTransition(
        signIn("signin-email", {
          ...payload,
          callbackUrl,
        }),
      )
    } catch (error: any) {
      errorToast(error.message)
      console.log(error)
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

    console.log(kakao, "kakao login")

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
      className="mx-auto mt-12 max-w-[500px] px-4 md:mt-28"
      onSubmit={handleSubmit(handleSignIn)}
    >
      <Link href="/">
        <h2 className="mb-12 text-center text-4xl font-bold text-main md:mb-16">
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
        className="my-6 w-full bg-main text-white hover:bg-main"
        disabled={isLoading}
      >
        {isLoading ? <Spinner className="h-5 w-5" /> : "로그인"}
      </Button>
      <p className="mt-2 text-center text-primary">
        아직 회원이 아니신가요?
        <Link href="/auth/sign-up">
          <span className="cursor-pointer text-main"> 회원가입</span>
        </Link>
      </p>
      <Link href="/auth/find-password" prefetch={false}>
        <p className="text-center text-main">비밀번호 찾기</p>
      </Link>
      <div className="mt-4 flex text-grey">
        <div className="mb-3 w-full border-b-2 border-grey" />
        <span className="mx-4 whitespace-nowrap font-semibold">간편로그인</span>
        <div className="mb-3 w-full border-b-2 border-grey" />
      </div>
      <div className="mx-auto mt-6 flex w-[200px] justify-between">
        <Button
          type="button"
          className="inline-flex h-[48px] w-[48px] items-center justify-center rounded-lg bg-white p-1 text-white shadow-md transition duration-150 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50"
          onClick={handleGoogleLogin}
        >
          <img src="/google_logo.png" alt="google_logo" />
        </Button>
        <button
          type="button"
          className="inline-flex h-[48px] w-[48px] items-center justify-center rounded-lg text-white shadow-md transition duration-150 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50"
          onClick={() => {
            console.log("naver login")
            handleNaverLogin()
          }}
        >
          <img src="/naver_logo.png" alt="naver_logo" />
        </button>
        <button
          type="button"
          className="inline-flex h-[48px] w-[48px] items-center justify-center rounded-lg bg-[#FEE500] text-white shadow-md transition duration-150 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50"
          onClick={() => {
            console.log("kakao login")
            kakaoLogin()
          }}
        >
          <img src="/kakao_logo.png" alt="kakao_logo" />
        </button>
      </div>
    </form>
  )
}

export default SignInForm
