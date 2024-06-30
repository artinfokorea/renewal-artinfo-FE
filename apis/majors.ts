import { ListApiResponse, ListResponse } from "@/interface"
import { MAJOR } from "@/types"
import { apiRequest } from "."
import { exceptionHandler } from "./exception-handler"
import { ArtField, MajorGroup } from "@/types/majors"
import { ArtFieldRequest } from "@/interface/majors"

export const getMajors = async (): Promise<ListResponse<MAJOR, "majors">> => {
  try {
    const response = await apiRequest.get<ListApiResponse<MAJOR, "majors">>(
      "/majors",
    )
    return response.item
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getMajors error"))
  }
}

export const getArtCategories = async () => {
  try {
    const response = await apiRequest.get<
      ListApiResponse<MajorGroup, "majorGroups">
    >("/majors/art")
    return response.item
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getArtCategories error"))
  }
}

export const getArtFileds = async (request: ArtFieldRequest) => {
  try {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(request)) {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key + "[]", v))
      } else if (value) {
        params.append(key, value)
      }
    }
    const response = await apiRequest.get<
      ListApiResponse<ArtField, "majorGroups">
    >("/majors/fields", {
      params,
    })
    return response.item
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getArtFileds error"))
  }
}
