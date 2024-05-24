import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { getSession, signOut } from "next-auth/react";

const baseURL = process.env.REST_API_BASE_URL;

const baseInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": `application/json`,
  },
});

baseInstance.interceptors.response.use(
  ({ data }) => data,
  (error: AxiosError) => {
    const { response } = error; // // 404 에러 처리

    if (response?.status === 401) {
      signOut({ callbackUrl: "/auth/sign-in" });
    }

    return Promise.reject(error);
  }
);

baseInstance.interceptors.request.use(async (config) => {
  const session: any = await getSession();

  if (session) {
    config.headers["Authorization"] = `Bearer ${session.token.accessToken}`;
  }
  return config;
});

interface ApiRequestMethods {
  get<T>(url: string, request?: AxiosRequestConfig): Promise<T>;
  post<T>(url: string, body?: any): Promise<T>;
  put<T>(url: string, body?: any): Promise<T>;
  patch<T>(url: string, body?: any): Promise<T>;
  delete<T>(url: string, id: any): Promise<T>;
}

export const apiRequest: ApiRequestMethods = {
  get: (url, request) => {
    console.log("🧸 get", { url, request });
    return baseInstance.get(url, request);
  },
  post: (url, body) => {
    console.log("🧸 post", { url, body });
    return baseInstance.post(url, body);
  },
  put: (url, body) => {
    console.log("🧸 put", { url, body });
    return baseInstance.put(url, body);
  },
  patch: (url, body) => {
    console.log("🧸 patch", { url, body });
    return baseInstance.patch(url, body);
  },
  delete: (url, id) => {
    console.log("🧸 delete", { url, id });
    return baseInstance.delete(`${url}/${id}`);
  },
};
