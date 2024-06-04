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

export type ListResponse<T> = {
  [key: string]: T[];
} & {
  totalCount?: number;
};

enum SuccessCode {
  OK,
}

export type SuccessResponse = {
  code: SuccessCode;
  message?: string;
  item?: any;
};

export type PostResponse = {
  id: number;
};
