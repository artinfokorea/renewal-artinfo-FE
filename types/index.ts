export enum DeviceType {
  TABLET,
}

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
