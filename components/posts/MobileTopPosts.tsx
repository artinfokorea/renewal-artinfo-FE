import { Post } from "@/types/posts"
import React, { useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import FallbackImage from "../common/FallbackImage"

interface MobileTopPostsProps {
  posts?: Post[]
  handleToggleMobileTopPosts: () => void
}

export const MobileTopPosts = ({
  posts,
  handleToggleMobileTopPosts,
}: MobileTopPostsProps) => {
  useEffect(() => {
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%", scale: 0.95 }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      className="fixed right-0 top-0 z-[100] h-full w-full overflow-y-auto bg-white"
    >
      <section>
        <div className="relative flex w-full items-center justify-center gap-2 border-b border-gray-200 px-4 py-2">
          <button
            onClick={handleToggleMobileTopPosts}
            className="absolute left-4 top-3"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold text-main">Top Series</h1>
        </div>
        <ol className="space-y-3 text-xs font-light">
          {posts?.map((post, index) => (
            <Link key={post.id} href={`/posts/${post.id}`}>
              <li className="flex justify-between border-b border-gray-200 px-4 py-3">
                <div className="flex flex-col gap-3">
                  <span
                    className={`flex h-[22px] w-14 items-center justify-center rounded-full text-xs ${index < 3 ? "bg-main font-semibold text-white" : "border border-main bg-white font-medium text-main"}`}
                  >
                    TOP {index + 1}
                  </span>
                  <div className="space-y-1">
                    <h2 className="line-clamp-2 break-all text-sm font-semibold">
                      {post.title}
                    </h2>
                    <h5 className="text-xs text-gray-900">{post.authorName}</h5>
                  </div>
                </div>
                {post.thumbnailImageUrl && (
                  <div className="flex items-center">
                    <FallbackImage
                      src={post.thumbnailImageUrl}
                      alt={post.authorName}
                      width={60}
                      height={60}
                      className="mx-6 rounded-full"
                    />
                  </div>
                )}
              </li>
            </Link>
          ))}
        </ol>
      </section>
    </motion.div>
  )
}
