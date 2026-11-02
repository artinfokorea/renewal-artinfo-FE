"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { forwardRef } from "react"
import { EyeIcon, MessageCircle } from "lucide-react"
import FallbackImage from "../common/FallbackImage"
import { Post, PostCategoryLabel } from "@/types/posts"
import filters from "@/lib/filters"
import { PostThumbsUpButton } from "./PostThumbsUpButton"

interface Props {
  post: Post
  isLastPage: boolean
}

const extractText = (html: string) => {
  if (typeof window === "undefined") return ""
  const div = document.createElement("div")
  div.innerHTML = html
  return (div.textContent || div.innerText || "").trim()
}

/** 나눔 목록 한 줄 — 카테고리·제목·본문 미리보기·메타, 오른쪽 정사각 썸네일 */
const PostCard = forwardRef<HTMLDivElement, Props>(
  ({ post, isLastPage }, ref) => {
    const pathname = usePathname()
    const filter = filters()

    return (
      <li className="border-t border-[#F2F4F6] first:border-t-0">
        <Link
          href={`${pathname}/${post.id}`}
          prefetch={false}
          className="group flex gap-4 py-4 md:gap-6 md:px-2 md:py-5"
        >
          <div className="flex min-w-0 flex-1 flex-col gap-1.5 md:gap-2">
            <span className="text-xs font-bold text-main md:text-[13px]">
              {PostCategoryLabel[post.category]}
            </span>
            <h3 className="line-clamp-2 break-keep text-[15px] font-bold leading-snug text-[#191F28] group-hover:text-main md:text-lg">
              {post.title}
            </h3>
            <p className="line-clamp-2 break-all text-[13px] leading-relaxed text-[#6B7684] md:text-sm">
              {extractText(post.contents)}
            </p>
            <div className="mt-0.5 flex items-center justify-between gap-3 text-[13px] text-[#8B95A1]">
              <span className="truncate">
                {post.authorName} · {filter.FROM_NOW_COMMENT(post.createdAt)}
              </span>
              <div className="flex shrink-0 items-center gap-3">
                <span className="flex items-center gap-1">
                  <EyeIcon className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">조회</span>
                  {post.viewCount}
                </span>
                <PostThumbsUpButton
                  postId={post.id}
                  isLiked={post.isLiked}
                  likeCount={post.likeCount}
                  isList
                />
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">댓글</span>
                  {post.commentCount}
                </span>
              </div>
            </div>
          </div>
          {post.thumbnailImageUrl && (
            <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[10px] border border-[#EEF0F3] md:h-[96px] md:w-[96px] md:rounded-xl">
              <FallbackImage
                src={post.thumbnailImageUrl}
                alt=""
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
          )}
        </Link>
        {!isLastPage && <div ref={ref} />}
      </li>
    )
  },
)

PostCard.displayName = "PostCard"

export default PostCard
