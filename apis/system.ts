import { ListApiResponse, ListResponse, SuccessResponse } from '@/interface';
import { apiRequest, baseInstance } from '.';
import { exceptionHandler } from './exception-handler';
import { IMAGE, MAJOR, PROVINCE } from '@/types';
import { VerifyPhoneCodePayload } from '@/interface/systems';
import { headers } from 'next/headers';

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

export const uploadImages = async (imageFiles: File[]): Promise<any> => {
  const formData = new FormData();
  imageFiles.forEach((file) => formData.append('imageFiles', file));
  formData.append('target', 'USER');

  try {
    const response = await baseInstance.post<any>(
      '/system/upload/images',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    console.log('response', response.item);
    return response.item;
  } catch (error) {
    throw new Error(exceptionHandler(error, 'API uploadImages error'));
  }
};

export const getMajors = async (): Promise<ListResponse<MAJOR, 'majors'>> => {
  try {
    const response = await apiRequest.get<ListApiResponse<MAJOR, 'majors'>>(
      '/common/majors'
    );
    return response.item;
  } catch (error) {
    throw new Error(exceptionHandler(error, 'API getMajors error'));
  }
};
