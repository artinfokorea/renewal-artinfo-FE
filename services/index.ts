import axios, { AxiosError, AxiosRequestConfig } from "axios"
import { getSession, signOut } from "next-auth/react"

const baseURL = process.env.REST_API_BASE_URL

export const publicInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": `application/json`,
  },
})

publicInstance.interceptors.response.use(({ data }) => data)

export const authInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": `application/json`,
  },
})

authInstance.interceptors.response.use(
  ({ data }) => data,
  (error: AxiosError) => {
    const { response } = error // // 404 에러 처리

    if (response?.status === 401) {
      signOut({ callbackUrl: "/auth/sign-in" })
    }

    return Promise.reject(error)
  },
)

authInstance.interceptors.request.use(async config => {
  const session: any = await getSession()

  if (session) {
    config.headers["Authorization"] = `Bearer ${session.token.accessToken}`
  }
  return config
})

interface ApiRequestMethods {
  get<T>(url: string, request?: AxiosRequestConfig): Promise<T>
  post<T>(url: string, body?: any, config?: Record<string, any>): Promise<T>
  put<T>(url: string, body?: any): Promise<T>
  patch<T>(url: string, body?: any): Promise<T>
  delete<T>(url: string, id?: any): Promise<T>
}

export const authApiRequest: ApiRequestMethods = {
  get: (url, request) => {
    console.log("🧸 get", { url, request })
    return authInstance.get(url, request)
  },
  post: (url, body, config?: {}) => {
    console.log("🧸 post", { url, body, config })
    return authInstance.post(url, body, config || {})
  },
  put: (url, body) => {
    console.log("🧸 put", { url, body })
    return authInstance.put(url, body)
  },
  patch: (url, body) => {
    console.log("🧸 patch", { url, body })
    return authInstance.patch(url, body)
  },
  delete: (url, id) => {
    console.log("🧸 delete", { url, id })
    return authInstance.delete(`${url}`)
  },
}

export const publicApiRequest: ApiRequestMethods = {
  get: (url, request) => {
    console.log("🧸 get", { url, request })
    return publicInstance.get(url, request)
  },
  post: (url, body, config?: {}) => {
    console.log("🧸 post", { url, body, config })
    return publicInstance.post(url, body, config || {})
  },
  put: (url, body) => {
    console.log("🧸 put", { url, body })
    return publicInstance.put(url, body)
  },
  patch: (url, body) => {
    console.log("🧸 patch", { url, body })
    return publicInstance.patch(url, body)
  },
  delete: (url, id) => {
    console.log("🧸 delete", { url, id })
    return publicInstance.delete(`${url}`)
  },
}
