import { AD, AdvertisementType } from "@/types/ads"
import { publicApiRequest } from "."
import { exceptionHandler } from "./exception-handler"
import { SuccessResponse } from "@/interface"

export const getAds = async (type: AdvertisementType): Promise<AD[]> => {
  try {
    const response = await publicApiRequest.get<SuccessResponse>(
      `/advertisements`,
      {
        params: {
          type,
        },
      },
    )
    return response.item as AD[]
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getAds error"))
  }
}
