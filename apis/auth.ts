import { DeviceType, RefreshTokenResponse, TokenResponse } from "@/types";
import { apiRequest } from ".";
import { exceptionHandler } from "./exception-handler";

interface SignInPayload {
  email: string;
  password: string;
}

interface SignUpPayload extends SignInPayload {
  phone: string;
  name: string;
}

interface RefreshTokenPayload {
  accessToken: string;
  refreshToken: string;
}

export const signIn = async (payload: SignInPayload) => {
  try {
    const response = await apiRequest.post<TokenResponse>("/auths/sign-in", {
      ...payload,
      deviceType: DeviceType.TABLET,
    });
    return response;
  } catch (error) {
    throw new Error(exceptionHandler(error, "API singin error"));
  }
};

export const singUp = async (payload: SignUpPayload) => {
  try {
    const response = await apiRequest.post<TokenResponse>("/auths/sign-up", {
      ...payload,
      deviceType: DeviceType.TABLET,
      clinicId: 1,
    });
    return response;
  } catch (error) {
    throw new Error(exceptionHandler(error, "API singup error"));
  }
};

export const refreshToken = async (payload: RefreshTokenPayload) => {
  try {
    const response = await apiRequest.post<RefreshTokenResponse>(
      "/auths/access-token",
      payload
    );
    return response;
  } catch (error) {
    throw new Error(exceptionHandler(error, "API refresh token error"));
  }
};
