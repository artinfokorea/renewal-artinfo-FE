import { USER } from "@/types/users"
import { apiRequest } from "."
import { exceptionHandler } from "./exception-handler"
import { DetailApiResponse, SuccessResponse } from "@/interface"
import { UserPayload } from "@/interface/users"

export const getMe = async (): Promise<USER> => {
  try {
    const response = await apiRequest.get<DetailApiResponse<USER>>("/users/me")
    return response.item
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getMe error"))
  }
}

export const updateUser = async (
  payload: UserPayload,
): Promise<SuccessResponse> => {
  const response = await apiRequest.put<SuccessResponse>("/users/me", payload)
  return response
}

export const updateUserPhone = async (
  phone: string,
): Promise<SuccessResponse> => {
  const response = await apiRequest.put<SuccessResponse>("/users/me/phone", {
    phone,
  })
  return response
}

export const updateUserPassword = async (
  password: string,
): Promise<SuccessResponse> => {
  const response = await apiRequest.put<SuccessResponse>("/users/me/password", {
    password,
  })
  return response
}
