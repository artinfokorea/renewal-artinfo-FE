"use client"

import React from "react"
import useToast from "./useToast"
import { useQueryClient } from "@tanstack/react-query"
import { likePost } from "@/services/posts"
import { queries } from "@/lib/queries"
import { useSearchParams } from "next/navigation"
import { PostCategory } from "@/types/posts"

export const usePostLike = (isList: boolean) => {
  const { successToast, errorToast } = useToast()
  const queryClient = useQueryClient()
  const searchParams = useSearchParams()
  const category = searchParams.get("category") as PostCategory
  const keyword = searchParams.get("keyword") as string

  const queryParams = {
    size: 10,
    keyword,
    category: category ? category : undefined,
  }

  const handlePostLike = async (postId: number, isLike: boolean) => {
    try {
      await likePost(postId, isLike)

      if (isList) {
        queryClient.setQueryData(
          queries.posts.infiniteList(queryParams).queryKey,
          (old: any) => {
            console.log("old", old)
            return {
              ...old,
              pages: old.pages.map((page: any) => ({
                ...page,
                posts: page.posts.map((post: any) =>
                  post.id === postId
                    ? {
                        ...post,
                        isLiked: isLike,
                        likeCount: isLike
                          ? post.likeCount + 1
                          : post.likeCount - 1,
                      }
                    : post,
                ),
              })),
            }
          },
        )
      }

      queryClient.invalidateQueries({
        queryKey: queries.posts._def,
      })
      successToast("좋아요 성공")
    } catch (error) {
      errorToast("좋아요 실패")
    }
  }

  return { handlePostLike }
}
