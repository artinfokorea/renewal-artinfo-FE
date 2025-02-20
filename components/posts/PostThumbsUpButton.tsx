"use client"

import { usePostLike } from "@/hooks/usePostLike"
import { ThumbsUpIcon } from "lucide-react"
import React from "react"

interface Props {
  postId: number
  isLiked: boolean
  likeCount: number
  isList: boolean
}

export const PostThumbsUpButton = ({
  postId,
  isLiked,
  likeCount,
  isList,
}: Props) => {
  const { handlePostLike } = usePostLike(isList)

  return (
    <button
      onClick={e => {
        e.preventDefault()
        handlePostLike(postId, !isLiked)
      }}
      className="flex items-center gap-1 text-gray-400"
    >
      {isLiked ? (
        <ThumbsUpIcon fill="currentColor" className="h-4 w-4 text-red-500" />
      ) : (
        <ThumbsUpIcon className="h-4 w-4 text-gray-400" />
      )}
      <span className="text-sm md:text-base">{likeCount}</span>
    </button>
  )
}
