"use client"

import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useEffect } from "react"

const Callback = () => {
  const searchParams = useSearchParams()
  const router = useRouter()

  let naver
  let naverLogin: any

  useEffect(() => {
    if (typeof window === "undefined") return

    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const state = searchParams.get("state") || hashParams.get("state")
    const code = searchParams.get("code")

    if (state === "naver") {
      naver = (window as any).naver
      naverLogin = new naver.LoginWithNaverId({
        clientId: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
        callbackUrl: process.env.NEXT_PUBLIC_REDIRECT_URL,
        isPopup: false,
      })

      checkNaverLogin(naverLogin)
    } else if (state === "kakao") {
      if (code) {
        checkKakaoLogin(code)
      }
    } else if (state === "google") {
      const googleMetaDataArr = window.location.hash.replace("#", "").split("&")
      if (googleMetaDataArr) {
        const obj = googleMetaDataArr.reduce((a: any, b) => {
          const splits = b.split("=")
          a[splits[0]] = splits[1]
          return a
        }, {})

        if (obj.state === "google" && obj.access_token) {
          signIn("sns", {
            accessToken: obj.access_token,
            type: "GOOGLE",
            callbackUrl: "/",
          })
        } else {
          router.push("auth")
        }
      }
    }
  }, [])

  const checkKakaoLogin = async (code: string) => {
    const Kakao = (window as any).Kakao
    if (Kakao && !Kakao.isInitialized()) {
      Kakao.init(process.env.NEXT_PUBLIC_KAKAO_API_KEY)
    }

    try {
      const res = await fetch(
        `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${process.env.NEXT_PUBLIC_KAKAO_API_KEY}&redirect_uri=http://localhost:3000/auth/callback&code=${code}`,
        {
          method: "POST",
        },
      )
        .then(res => res.json())
        .catch(e => console.log(e))

      signIn("sns", {
        accessToken: res.access_token,
        type: "KAKAO",
        callbackUrl: "/",
      })
    } catch (e: any) {
      console.error("kakao login error", e)
    }
  }

  const checkNaverLogin = (naverLogin: any) => {
    naverLogin.init()

    naverLogin.getLoginStatus(function (status: boolean) {
      if (status) {
        signIn("sns", {
          accessToken: naverLogin.loginStatus.accessToken.accessToken,
          type: "NAVER",
          callbackUrl: "/",
        })
      }
    })
  }

  return <div></div>
}

export default Callback
