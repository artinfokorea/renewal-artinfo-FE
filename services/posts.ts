import {
  DetailApiResponse,
  ListApiResponse,
  ListResponse,
  PostResponse,
  ScrollApiResponse,
  SuccessResponse,
} from "@/interface"
import { exceptionHandler } from "./exception-handler"
import { authApiRequest, publicApiRequest } from "."
import { PostsRequest } from "@/interface/posts"
import { Post } from "@/types/posts"

/* 글 리스트 조회 */
export const getPosts = async (
  request: PostsRequest,
): Promise<ListResponse<Post, "posts">> => {
  try {
    const response = await authApiRequest.get<ListApiResponse<Post, "posts">>(
      "/posts",
      {
        params: request,
      },
    )
    return response.item
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getPosts error"))
  }
}

/* 글 스크롤 리스트 조회 */
export const getInfinitePosts = async (
  request: PostsRequest,
): Promise<ScrollApiResponse<Post, "posts">> => {
  const response = await getPosts(request)
  return {
    posts: response.posts,
    nextPage: request.page ? request.page + 1 : 2,
    isLast: response.posts.length < request.size,
    totalCount: response.totalCount ?? 0,
  }
}

/* 글 상세 조회 */
export const getPostDetail = async (postId: number): Promise<Post> => {
  try {
    const response = await authApiRequest.get<DetailApiResponse<Post>>(
      `/posts/${postId}`,
    )
    return response.item
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getPostDetail error"))
  }
}

/* 글 생성 */
export const createPost = async (payload: any): Promise<PostResponse> => {
  const response = await authApiRequest.post<PostResponse>(`/posts`, payload)
  return response
}

/* 글 수정 */
export const updatePost = async (
  postId: number,
  payload: any,
): Promise<PostResponse> => {
  const response = await authApiRequest.put<PostResponse>(
    `/posts/${postId}`,
    payload,
  )
  return response
}

/* 글 좋아요 */
export const likePost = async (
  postId: number,
  isLike: boolean,
): Promise<SuccessResponse> => {
  const response = await authApiRequest.post<SuccessResponse>(
    `/posts/like/${postId}`,
    { isLike },
  )
  return response
}

/* 글 삭제 */
export const deletePost = async (postId: number): Promise<SuccessResponse> => {
  const response = await authApiRequest.delete<SuccessResponse>(
    `/posts/${postId}`,
  )
  return response
}

/* 인기 게시글 조회 */
export const getPopularPosts = async (): Promise<
  ListResponse<Post, "posts">
> => {
  const response =
    await publicApiRequest.get<ListApiResponse<Post, "posts">>("/posts/top")
  return response.item
}
