"use client"

import { createPerformanceInquiry } from "@/services/inquries"
import PerformanceInquiryForm from "@/components/inquiry/PerformanceInquiryForm"
import useToast from "@/hooks/useToast"
import { useLoading } from "@toss/use-loading"
import { useRouter } from "next/navigation"
import React from "react"
import { PerformanceInquiryPayload } from "@/interface/inquiries"

const page = () => {
  const [isHandleFormLoading, handleFormTransition] = useLoading()
  const router = useRouter()

  const { successToast, errorToast } = useToast()

  const handleInquiry = async (payload: PerformanceInquiryPayload) => {
    try {
      await handleFormTransition(createPerformanceInquiry(payload))
      successToast("기획 문의가 성공적으로 등록되었습니다.")
      router.push("/")
    } catch (error: any) {
      errorToast(error.message)
      console.error(error)
    }
  }

  return (
    <section className="mx-auto max-w-screen-sm">
      <div className="relative mx-4 mt-6 overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-12 text-center text-white md:mt-8 md:py-16">
        <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-white/10" />
        <div className="absolute left-1/4 top-1/2 h-20 w-20 rounded-full bg-white/5" />
        <div className="relative">
          <div className="mb-4 flex justify-center gap-2">
            <span className="text-3xl">🎵</span>
            <span className="text-3xl">🎹</span>
            <span className="text-3xl">🎻</span>
          </div>
          <h1 className="text-2xl font-bold md:text-3xl">
            아티스트의 연주를 응원합니다
          </h1>
          <p className="mt-3 text-sm text-white/80 md:text-base">
            공연 기획이 필요하시면 문의해주세요
          </p>
        </div>
      </div>
      <PerformanceInquiryForm
        handleInquiry={handleInquiry}
        isLoading={isHandleFormLoading}
      />
    </section>
  )
}

export default page
