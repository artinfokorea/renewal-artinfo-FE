export enum AdvertisementType {
  BANNER = "BANNER",
  CONCERT = "CONCERT",
  EXHIBITION = "EXHIBITION",
}

export type AD = {
  id: number
  title: string
  imageUrl: string
  redirectUrl: string
}
