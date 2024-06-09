import { USER } from '@/types/users';
import { apiRequest } from '.';
import { exceptionHandler } from './exception-handler';
import { SuccessResponse } from '@/interface';
import { UserPayload } from '@/interface/users';

export const getMe = async (): Promise<USER> => {
  try {
    const response = await apiRequest.get<USER>('/users/me');
    return response;
  } catch (error) {
    throw new Error(exceptionHandler(error, 'API getMe error'));
  }
};

export const updateUser = async (
  payload: UserPayload
): Promise<SuccessResponse> => {
  try {
    const response = await apiRequest.put<SuccessResponse>(
      '/users/me',
      payload
    );
    return response;
  } catch (error) {
    throw new Error(exceptionHandler(error, 'API updateUser error'));
  }
};
