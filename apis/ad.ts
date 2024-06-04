import { AD, AdvertisementType } from "@/types/ads";
import { apiRequest } from ".";
import { exceptionHandler } from "./exception-handler";
import { ListResponse } from "@/interface";

export const getAds = async (
  type: AdvertisementType
): Promise<ListResponse<AD>> => {
  try {
    const response = await apiRequest.get<ListResponse<AD>>(`/advertisements`, {
      params: {
        type,
      },
    });
    return response;
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getAds error"));
  }
};
