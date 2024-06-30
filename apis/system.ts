import { ListApiResponse, ListResponse, SuccessResponse } from "@/interface"
import { apiRequest } from "."
import { exceptionHandler } from "./exception-handler"
import { IMAGE, PROVINCE } from "@/types"
import { VerifyPhoneCodePayload } from "@/interface/systems"

export const getProvinces = async (
  depth?: number,
): Promise<ListResponse<PROVINCE, "provinces">> => {
  try {
    const response = await apiRequest.get<
      ListApiResponse<PROVINCE, "provinces">
    >("/provinces", {
      params: {
        parentId: depth,
      },
    })
    return response.item
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getProvince error"))
  }
}

export const sendPhoneVerificationCode = async (
  phone: string,
): Promise<SuccessResponse> => {
  const response = await apiRequest.post<SuccessResponse>(
    "/verifications/mobile",
    { phone },
  )
  return response
}

export const verifyPhoneCode = async (
  payload: VerifyPhoneCodePayload,
): Promise<SuccessResponse> => {
  const response = await apiRequest.put<SuccessResponse>(
    "/verifications/mobile",
    payload,
  )
  return response
}

export const uploadImages = async (
  imageFiles: File[],
): Promise<ListResponse<IMAGE, "images">> => {
  const formData = new FormData()
  imageFiles.forEach(file => formData.append("imageFiles", file))
  formData.append("target", "USER")

  const response = await apiRequest.post<ListApiResponse<IMAGE, "images">>(
    "/system/upload/images",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  )

  return response.item
}
