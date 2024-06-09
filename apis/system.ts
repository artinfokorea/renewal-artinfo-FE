import { ListApiResponse, ListResponse, SuccessResponse } from '@/interface';
import { apiRequest } from '.';
import { exceptionHandler } from './exception-handler';
import { PROVINCE } from '@/types';
import { VerifyPhoneCodePayload } from '@/interface/systems';

export const getProvince = async (): Promise<
  ListResponse<PROVINCE, 'province'>
> => {
  try {
    const response = await apiRequest.get<
      ListApiResponse<PROVINCE, 'province'>
    >('/system/province');
    return response.item;
  } catch (error) {
    throw new Error(exceptionHandler(error, 'API getProvince error'));
  }
};

export const sendPhoneVerificationCode = async (
  phone: string
): Promise<SuccessResponse> => {
  try {
    const response = await apiRequest.post<SuccessResponse>(
      '/verifications/mobile',
      { phone }
    );
    return response;
  } catch (error) {
    throw new Error(
      exceptionHandler(error, 'API sendPhoneVerificationCode error')
    );
  }
};

export const verifyPhoneCode = async (
  payload: VerifyPhoneCodePayload
): Promise<SuccessResponse> => {
  try {
    const response = await apiRequest.put<SuccessResponse>(
      '/verifications/mobile',
      payload
    );
    return response;
  } catch (error) {
    throw new Error(exceptionHandler(error, 'API verifyPhoneCode error'));
  }
};
