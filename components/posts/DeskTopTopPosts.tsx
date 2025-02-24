import { Post } from "@/types/posts"
import Link from "next/link"
import React from "react"

interface Props {
  posts?: Post[]
}

export const DeskTopTopPosts = ({ posts }: Props) => {
  return (
    <article className="ml-4 hidden h-fit min-h-[150px] w-[130px] space-y-4 rounded-md border border-[#d9d9d9] px-3 py-4 lg:block">
      <h5 className="text-sm font-semibold">Top Series</h5>
      <ol className="flex list-inside list-decimal flex-col gap-3 text-xs font-light">
        {posts?.map((post, index) => (
          <Link href={`/posts/${post.id}`} key={post.id}>
            <li className="line-clamp-2 break-all">
              {index + 1}. {post.title}
            </li>
          </Link>
        ))}
      </ol>
    </article>
  )
}
