import { PostResponse } from '@/interface';
import { apiRequest } from '.';
import { InquiryPayload } from '@/interface/inquiries';

/* 문의 생성 */
export const createFullTimeJob = async (
  payload: InquiryPayload
): Promise<PostResponse> => {
  const response = await apiRequest.post<PostResponse>(`/inquiries`, payload);
  return response;
};
