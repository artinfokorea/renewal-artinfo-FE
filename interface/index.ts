export type TokenResponse = {
  accessToken: {
    token: string;
    type: string;
    expiresIn: Date;
  };
  refreshToken: {
    token: string;
    type: string;
    expiresIn: Date;
  };
};

export type RefreshTokenResponse = {
  token: string;
  type: string;
  expiresIn: Date;
};

enum SuccessCode {
  OK = "OK",
}

export type SuccessResponse = {
  code: SuccessCode;
  message?: string;
  item?: any;
};

export type ApiResponse<T, K extends string = string> = {
  code: SuccessCode;
  message?: string;
  item: ListResponse<T, K>;
};

export type ListResponse<T, K extends string = string> = {
  [key in K]: T[];
} & {
  totalCount?: number;
};

export type PostResponse = {
  id: number;
};

export type ScrollApiResponse<T, K extends string = string> = {
  [key in K]: T[];
} & {
  nextPage: number;
  isLast: boolean;
};
