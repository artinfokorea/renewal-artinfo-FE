"use client"

import { deleteNews } from "@/services/news"
import NewsDetailContainer from "@/components/news/NewsDetailContainer"
import useMutation from "@/hooks/useMutation"
import { queries } from "@/lib/queries"
import { useParams, usePathname } from "next/navigation"
import React from "react"

import { Post } from "@/types/posts"
import { deletePost } from "@/services/posts"
import PostDetailContainer from "./PostDetailContainer"
import { useQuery } from "@tanstack/react-query"

interface Props {
  post: Post
}

const PostDetailClient = ({ post }: Props) => {
  const params = useParams()
  const pathname = usePathname()

  const { handleDelete } = useMutation({
    deleteFn: () => deletePost(Number(params.id) as number),
    queryKey: [...queries.posts._def],
    redirectPath: pathname.slice(0, pathname.lastIndexOf("/")),
    successMessage: {
      delete: "커뮤니티가 삭제되었습니다.",
    },
  })

  const { data: postDetail } = useQuery({
    ...queries.posts.detail(Number(params.id) as number),
    enabled: !!params.id,
    initialData: post,
  })

  return (
    <section>
      <PostDetailContainer post={postDetail} deletePost={handleDelete} />
    </section>
  )
}

export default PostDetailClient
