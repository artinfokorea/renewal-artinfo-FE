export type TokenResponse = {
  accessToken: {
    token: string
    type: string
    expiresIn: Date
  }
  refreshToken: {
    token: string
    type: string
    expiresIn: Date
  }
}

export type RefreshTokenResponse = {
  token: string
  type: string
  expiresIn: Date
}

export enum SuccessCode {
  OK = "OK",
}

export type SuccessResponse = {
  code: SuccessCode
  message?: string
  item?: any
}

export type ListApiResponse<T, K extends string = string> = {
  code: SuccessCode
  message?: string
  item: ListResponse<T, K>
}

export type DetailApiResponse<T> = {
  code: SuccessCode
  message?: string
  item: T
}

export type ListResponse<T, K extends string = string> = {
  [key in K]: T[]
} & {
  totalCount?: number
}

export type PostResponse = {
  id: number
}

export type ScrollApiResponse<T, K extends string> = {
  [key in K]: T[]
} & {
  nextPage: number
  isLast: boolean
  totalCount: number
}

export interface IconProps {
  className?: string
}
