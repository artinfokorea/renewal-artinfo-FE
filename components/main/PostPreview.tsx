import { EyeIcon, Send } from "lucide-react"
import Link from "next/link"
import React from "react"
import { Separator } from "../ui/separator"
import { queries } from "@/lib/queries"
import { useSuspenseQuery } from "@tanstack/react-query"

export const PostPreview = () => {
  const { data: posts } = useSuspenseQuery({
    ...queries.posts.list({
      page: 1,
      size: 5,
    }),
  })

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-xl font-bold">
          <Send className="h-5 w-5" />
          나눔
        </h3>
        <Link href="/posts">
          <h5 className="font-bold text-silver">더보기</h5>
        </Link>
      </div>
      <Separator className="mb-4 mt-2 h-[1px] bg-gray-200" />
      <div className="flex flex-col gap-6">
        {posts.posts.map(post => (
          <Link key={post.id} href={`/posts/${post.id}`}>
            <div className="flex items-center justify-between gap-4">
              <h4 className="line-clamp-1 text-sm font-semibold md:text-base">
                {post.title}
              </h4>
              <div className="flex items-center gap-2 text-gray-400">
                <EyeIcon className="h-4 w-4" />
                <span className="min-w-8 text-right text-sm">
                  {post.viewCount}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
