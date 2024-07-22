import { PostResponse } from "@/interface"
import { publicApiRequest } from "."
import { InquiryPayload } from "@/interface/inquiries"

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
