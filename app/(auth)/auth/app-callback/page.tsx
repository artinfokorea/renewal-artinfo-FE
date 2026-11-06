"use client"

import React, { useEffect, useState } from "react"

/** 아트인포 iOS/Android 앱이 OAuth 결과를 받는 딥링크 */
const APP_CALLBACK_URL = "artinfo://auth/callback"

/**
 * 앱 간편로그인 중계 페이지.
 * 구글·네이버는 http(s) 리다이렉트 URI 만 허용하므로, 앱은 이 페이지를 리다이렉트 URI 로 쓴다.
 * 여기서 쿼리/해시로 받은 OAuth 결과(access_token, state, error 등)를 그대로 앱 딥링크로 넘긴다.
 */
const AppCallbackPage = () => {
  const [appUrl, setAppUrl] = useState(APP_CALLBACK_URL)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    new URLSearchParams(window.location.hash.replace(/^#/, "")).forEach((value, key) => {
      params.set(key, value)
    })
    const url = `${APP_CALLBACK_URL}?${params.toString()}`
    setAppUrl(url)
    window.location.replace(url)
  }, [])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-base font-semibold text-gray-800">아트인포 앱으로 돌아가는 중입니다…</p>
      <a href={appUrl} className="text-sm text-main underline">
        자동으로 이동하지 않으면 여기를 눌러주세요
      </a>
    </div>
  )
}

export default AppCallbackPage
