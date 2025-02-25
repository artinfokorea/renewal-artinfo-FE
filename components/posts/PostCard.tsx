"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { forwardRef } from "react"
import FallbackImage from "../common/FallbackImage"
import { Post, PostCategoryLabel } from "@/types/posts"
import filters from "@/lib/filters"
import { EyeIcon, MessageCircle, ThumbsUpIcon } from "lucide-react"
import { usePostLike } from "@/hooks/usePostLike"
import { PostThumbsUpButton } from "./PostThumbsUpButton"

interface Props {
  post: Post
  isLastPage: boolean
  isLeft: boolean
}

const PostCard = forwardRef<HTMLDivElement, Props>(
  ({ post, isLastPage, isLeft }, ref) => {
    const pathname = usePathname()
    const filter = filters()

    const extractTextFromHtml = (html: string) => {
      if (typeof window === "undefined") return ""

      const div = document.createElement("div")
      div.innerHTML = html
      div.style.cssText = `
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        word-break: break-all;
        line-height: 1.5;
        max-height: 3em;
      `
      const text = div.textContent || div.innerText || ""

      return text.slice(0, 40) + (text.length > 40 ? "..." : "")
    }

    return (
      <Link href={`${pathname}/${post.id}`} prefetch={false}>
        <div
          className={`flex flex-col justify-between border-b border-gray-300 py-3 md:h-[210px] md:py-6 ${isLeft ? "md:border-r md:pr-6" : "md:pl-6"}`}
        >
          <h4 className="text-xs font-light">
            {PostCategoryLabel[post.category]}
          </h4>
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-5">
              <h2 className="line-clamp-2 break-all text-base font-normal md:font-semibold lg:mt-1">
                {post.title}
              </h2>
              <div className="hidden text-sm font-light md:block lg:h-10">
                {extractTextFromHtml(post.contents)}
              </div>
            </div>
            {post.thumbnailImageUrl && (
              <FallbackImage
                src={post.thumbnailImageUrl}
                alt={post.title}
                width={80}
                height={80}
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                }}
                className="hidden rounded-[10px] md:block"
              />
            )}
          </div>
          <div className="space-y-1 lg:mt-1">
            <p className="hidden text-xs font-light md:block">
              {post.authorName}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex space-x-6">
                <div className="flex items-center gap-1 text-gray-400">
                  <EyeIcon className="h-4 w-4" />
                  <span className="text-sm leading-none md:text-base">
                    {post.viewCount}
                  </span>
                </div>
                <PostThumbsUpButton
                  postId={post.id}
                  isLiked={post.isLiked}
                  likeCount={post.likeCount}
                  isList
                />
                <div className="flex items-center gap-1 text-gray-400">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm leading-none md:text-base">
                    {post.commentCount}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-400">
                {filter.FROM_NOW_COMMENT(post.createdAt)}
              </p>
            </div>
          </div>
          {!isLastPage && <div ref={ref} />}
        </div>
      </Link>
    )
  },
)

PostCard.displayName = "PostCard"

export default PostCard
