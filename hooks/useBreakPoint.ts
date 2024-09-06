"use client"

import { useState, useEffect } from "react"

type ScreenSize = "sm" | "md" | "lg" | "xl"

const useBreakPoint = (size: ScreenSize) => {
  const screen = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  }

  const breakPoint = screen[size]

  const [isBreakPoint, setIsBreakPoint] = useState(false)

  useEffect(() => {
    const checkBreakPoint = () => {
      if (typeof window !== "undefined") {
        setIsBreakPoint(window.innerWidth >= breakPoint)
      }
    }

    checkBreakPoint()

    window.addEventListener("resize", checkBreakPoint)

    return () => {
      window.removeEventListener("resize", checkBreakPoint)
    }
  }, [breakPoint])

  return isBreakPoint
}

export default useBreakPoint
