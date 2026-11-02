"use client"

import { useEffect, useRef } from "react"
import { useSession } from "next-auth/react"

/**
 * 방문 하트비트 — 관리자 지표(DAU·WAU·MAU·리텐션·체류시간)의 원본.
 * 비회원도 보낸다. 브라우저마다 무작위 방문자 ID(UUID) 하나를 localStorage 에 두고,
 * 탭이 화면에 보이는 동안의 시간만 세서 1분마다, 그리고 탭을 떠날 때 서버로 보낸다.
 * 로그인 상태면 토큰을 붙여 서버가 회원 ID 도 남긴다. 개인정보는 보내지 않는다.
 */

const VISITOR_KEY = "artinfo_vid"
const LAST_PING_KEY = "artinfo_last_ping"
const PING_INTERVAL_MS = 60 * 1000
/** 30분 넘게 쉬었다 오면 새 방문으로 센다 */
const SESSION_GAP_MS = 30 * 60 * 1000

const uuidV4 = () => {
  const c: Crypto = window.crypto
  if (typeof c.randomUUID === "function") return c.randomUUID()
  const bytes = c.getRandomValues(new Uint8Array(16))
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = Array.from(bytes, (b: number) => b.toString(16).padStart(2, "0")).join("")
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

const storage = {
  get(key: string) {
    try {
      return window.localStorage.getItem(key)
    } catch {
      return null
    }
  },
  set(key: string, value: string) {
    try {
      window.localStorage.setItem(key, value)
    } catch {
      // 저장이 막힌 브라우저(사생활 보호 모드 등)는 이번 탭에서만 같은 ID 를 쓴다
    }
  },
}

const ActivityTracker = () => {
  const { data: session } = useSession()
  const tokenRef = useRef<string | null>(null)
  tokenRef.current = (session as any)?.token?.accessToken ?? null

  useEffect(() => {
    // 로컬·미리보기 배포에서 운영 지표가 오염되지 않게 실제 도메인에서만 보낸다
    const host = window.location.hostname
    if (host !== "artinfokorea.com" && !host.endsWith(".artinfokorea.com")) return
    const baseURL = process.env.REST_API_BASE_URL
    if (!baseURL) return

    let visitorId = storage.get(VISITOR_KEY)
    if (!visitorId) {
      visitorId = uuidV4()
      storage.set(VISITOR_KEY, visitorId)
    }

    let visibleSince: number | null =
      document.visibilityState === "visible" ? Date.now() : null
    let pendingMs = 0

    const collect = () => {
      if (visibleSince !== null) {
        const now = Date.now()
        pendingMs += now - visibleSince
        visibleSince = now
      }
    }

    const send = (keepalive = false) => {
      collect()
      const last = Number(storage.get(LAST_PING_KEY) ?? 0)
      const newSession = !last || Date.now() - last > SESSION_GAP_MS
      const seconds = Math.round(pendingMs / 1000)
      if (!newSession && seconds === 0) return
      pendingMs = 0
      storage.set(LAST_PING_KEY, String(Date.now()))

      const headers: Record<string, string> = { "Content-Type": "application/json" }
      if (tokenRef.current) headers.Authorization = `Bearer ${tokenRef.current}`

      // 지표 전송 실패는 사용자에게 영향이 없어야 한다 — 오류는 무시
      fetch(`${baseURL}/activity/ping`, {
        method: "POST",
        headers,
        body: JSON.stringify({ visitorId, seconds, newSession }),
        keepalive,
      }).catch(() => {})
    }

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        visibleSince = Date.now()
        send()
      } else {
        collect()
        visibleSince = null
        send(true)
      }
    }

    const onPageHide = () => send(true)

    send()
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") send()
    }, PING_INTERVAL_MS)
    document.addEventListener("visibilitychange", onVisibility)
    window.addEventListener("pagehide", onPageHide)

    return () => {
      window.clearInterval(timer)
      document.removeEventListener("visibilitychange", onVisibility)
      window.removeEventListener("pagehide", onPageHide)
    }
  }, [])

  return null
}

export default ActivityTracker
