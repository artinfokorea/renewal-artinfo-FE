import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { forwardRef } from "react"
import FallbackImage from "../common/FallbackImage"
import { Post, PostCategoryLabel } from "@/types/posts"
import filters from "@/lib/filters"
import { EyeIcon, MessageCircle, ThumbsUpIcon } from "lucide-react"

interface Props {
  post: Post
  isLastPage: boolean
  isLeft: boolean
}

const PostCard = forwardRef<HTMLDivElement, Props>(
  ({ post, isLastPage, isLeft }, ref) => {
    const pathname = usePathname()
    const filter = filters()

    return (
      <Link href={`${pathname}/${post.id}`} prefetch={false}>
        <div
          className={`border-b border-gray-300 py-3 md:py-6 ${isLeft ? "md:border-r md:pr-6" : "md:pl-6"}`}
        >
          <h4 className="text-xs font-light">
            {PostCategoryLabel[post.category]}
          </h4>
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-6">
              <h2 className="text-base font-normal md:font-semibold">
                {post.title}
              </h2>
              <h4 className="line-clamp-2 hidden text-sm font-light md:block">
                {post.contents}
              </h4>
            </div>
            {post.thumbnailImageUrl && (
              <FallbackImage
                src={post.thumbnailImageUrl}
                alt={post.title}
                width={80}
                height={80}
                className="hidden rounded-[10px] md:block"
              />
            )}
          </div>
          <div className="space-y-2 md:mt-4">
            <p className="hidden text-xs font-light md:block">
              {post.authorName}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex space-x-6">
                <button className="flex items-center gap-1 text-gray-300">
                  <EyeIcon className="h-4 w-4" />
                  <span className="text-xs leading-none">{post.viewCount}</span>
                </button>
                <button className="flex items-center gap-1 text-gray-300">
                  <ThumbsUpIcon className="h-4 w-4" />
                  <span className="text-xs leading-none">{post.likeCount}</span>
                </button>
                <button className="flex items-center gap-1 text-gray-300">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-xs leading-none">
                    {post.commentCount}
                  </span>
                </button>
              </div>
              <span className="text-xs font-light">
                {filter.FROM_NOW_COMMENT(post.createdAt)}
              </span>
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
