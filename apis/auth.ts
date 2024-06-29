import { SuccessResponse } from "@/interface"
import { apiRequest } from "."
import { exceptionHandler } from "./exception-handler"
import { SignUpPayload } from "@/interface/users"

export const signUp = async (payload: SignUpPayload) => {
  const response = await apiRequest.post("/auths/sign-up", payload)
  return response
}

export const isDuplicateEmail = async (email: string) => {
  try {
    const response = await apiRequest.get<SuccessResponse>(
      `/verifications/email/existence`,
      {
        params: {
          email: email,
        },
      },
    )
    return response.item
  } catch (error) {
    throw new Error(exceptionHandler(error, "API isDuplicateEmail error"))
  }
}

export const sendEmailVerificationCode = async (email: string) => {
  const response = await apiRequest.post<SuccessResponse>(
    `/verifications/email`,
    { email },
  )
  return response
}

export const checkEmailVerificationCode = async (
  email: string,
  verification: string,
): Promise<SuccessResponse> => {
  const response = await apiRequest.put<SuccessResponse>(
    `/verifications/email`,
    { email, verification },
  )
  return response
}
