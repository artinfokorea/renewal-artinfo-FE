import { AD, AdvertisementType } from "@/types/ads";
import { apiRequest } from ".";
import { exceptionHandler } from "./exception-handler";
import { ApiResponse, ListResponse } from "@/interface";

export const getAds = async (
  type: AdvertisementType
): Promise<ListResponse<AD, "advertisements">> => {
  try {
    const response = await apiRequest.get<ApiResponse<AD, "advertisements">>(
      `/advertisements`,
      {
        params: {
          type,
        },
      }
    );
    return response.item;
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getAds error"));
  }
};
