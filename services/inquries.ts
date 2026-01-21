import { PostResponse } from "@/interface"
import { publicApiRequest } from "."
import { InquiryPayload, PerformanceInquiryPayload } from "@/interface/inquiries"

/* 문의 생성 */
export const createInquiry = async (
  payload: InquiryPayload,
): Promise<PostResponse> => {
  const response = await publicApiRequest.post<PostResponse>(
    `/inquiries`,
    payload,
  )
  return response
}

/* 기획 문의 생성 */
export const createPerformanceInquiry = async (
  payload: PerformanceInquiryPayload,
): Promise<PostResponse> => {
  const response = await publicApiRequest.post<PostResponse>(
    `/inquiries/performance`,
    payload,
  )
  return response
}
