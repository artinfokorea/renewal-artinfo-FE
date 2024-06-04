export enum AdvertisementType {
  BANNER = "BANNER",
  CONCERT = "CONCERT",
}

export type AD = {
  id: number;
  title: string;
  imageUrl: string;
  redirectUrl: string;
};
