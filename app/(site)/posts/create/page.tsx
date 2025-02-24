"use client"

import PostForm, { PostFormData } from "@/components/posts/PostForm"
import useMutation from "@/hooks/useMutation"
import { PostPayload } from "@/interface/posts"
import { queries } from "@/lib/queries"
import { createPost, updatePost } from "@/services/posts"
import { useQuery } from "@tanstack/react-query"
import { usePathname, useSearchParams } from "next/navigation"
import React from "react"

const page = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const postId = searchParams.get("postId")

  const { handleSubmit, isLoading } = useMutation<PostPayload>({
    createFn: (payload: PostPayload) => createPost(payload),
    updateFn: (id: number, payload: PostPayload) => updatePost(id, payload),
    queryKey: [...queries.posts._def],
    redirectPath: pathname.slice(0, pathname.lastIndexOf("/")),
    successMessage: {
      create: "게시글이 등록되었습니다.",
      update: "게시글이 수정되었습니다.",
    },
  })

  const { data: post } = useQuery({
    ...queries.posts.detail(Number(postId)),
    enabled: !!postId,
  })

  const extractFirstImageUrl = (htmlContent: string): string | null => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent, "text/html")
    const firstImg = doc.querySelector("img")
    return firstImg?.src || null
  }

  const handlePostForm = async (formData: PostFormData) => {
    const payload: PostPayload = {
      ...formData,
    }

    const thumbnailImageUrl = extractFirstImageUrl(payload.contents)

    if (thumbnailImageUrl) {
      payload.thumbnailImageUrl = thumbnailImageUrl
    }
    !postId ? handleSubmit(payload) : handleSubmit(payload, Number(postId))
  }

  return (
    <section className="mx-auto max-w-screen-lg">
      <PostForm
        post={post}
        handlePost={handlePostForm}
        isFormLoading={isLoading}
      />
    </section>
  )
}

export default page
