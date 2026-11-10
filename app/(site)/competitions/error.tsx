"use client"

/** 콩쿠르 목록·상세를 못 받았을 때 (API 점검 등) — 페이지 전체 대신 이 구역만 안내 */
const error = ({ reset }: { error: Error; reset: () => void }) => (
  <div className="mx-auto flex min-h-[40vh] max-w-[1040px] flex-col items-center justify-center gap-4 px-4 text-center">
    <p className="text-[15px] text-coolgray">콩쿠르 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>
    <button type="button" onClick={reset} className="h-10 rounded-[10px] border border-[#E5E8EB] px-4 text-[14px] font-bold text-[#191F28]">
      다시 시도
    </button>
  </div>
)

export default error
