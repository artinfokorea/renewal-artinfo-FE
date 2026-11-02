import { Post } from "@/types/posts"
import Link from "next/link"
import React from "react"

interface Props {
  posts?: Post[]
}

/** 인기 글 (Top Stories) — 목록 위 작은 박스, 데스크톱은 2열 */
const TopPosts = ({ posts }: Props) => {
  if (!posts || posts.length === 0) return null

  return (
    <section
      aria-labelledby="top-posts-heading"
      className="mt-6 rounded-2xl bg-[#F7F8FA] px-5 py-4 md:mt-8"
    >
      <h2
        id="top-posts-heading"
        className="text-sm font-bold text-[#191F28]"
      >
        인기 글
      </h2>
      <ol className="mt-2 grid grid-cols-1 gap-x-8 md:grid-cols-2">
        {posts.slice(0, 6).map((post, index) => (
          <li key={post.id}>
            <Link
              href={`/posts/${post.id}`}
              className="flex items-center gap-3 py-1.5 text-sm text-[#333D4B] hover:text-main"
            >
              <span className="w-4 shrink-0 font-bold text-main">
                {index + 1}
              </span>
              <span className="truncate">{post.title}</span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default TopPosts
