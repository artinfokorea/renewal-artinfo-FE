import { ListApiResponse, ListResponse } from "@/interface"
import { publicApiRequest } from "."
import { exceptionHandler } from "./exception-handler"
import { ArtField, MAJOR, MajorGroup, PartTimeMajorGroup } from "@/types/majors"
import { ArtFieldRequest } from "@/interface/majors"

export const getMajors = async (): Promise<ListResponse<MAJOR, "majors">> => {
  try {
    const response =
      await publicApiRequest.get<ListApiResponse<MAJOR, "majors">>("/majors")
    return response.item
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getMajors error"))
  }
}

export const getArtCategories = async () => {
  try {
    const response =
      await publicApiRequest.get<ListApiResponse<MajorGroup, "majorGroups">>(
        "/majors/art",
      )
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
        value.forEach(v => params.append(key, v.toString()))
      } else if (value) {
        params.append(key, value.toString())
      }
    }
    const response = await publicApiRequest.get<
      ListApiResponse<ArtField, "majorGroups">
    >("/majors/fields", {
      params,
    })
    return response.item
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getArtFileds error"))
  }
}

/* 전문 분야 그룹 조회 */
export const getPartTimeMajorGroups = async () => {
  const response =
    await publicApiRequest.get<
      ListApiResponse<PartTimeMajorGroup, "majorGroups">
    >("/majors/groups")
  return response.item
}
