import filters from "@/lib/filters"
import { queries } from "@/lib/queries"
import { UserType } from "@/types/users"
import { useQuery } from "@tanstack/react-query"
import React, { useState } from "react"
import ItemManageBox from "../common/ItemManageBox"
import { useRouter } from "next/navigation"
import ConfirmDialog from "../dialog/ConfirmDialog"
import { useSession } from "next-auth/react"
import CommentContainer from "../news-comments/NewsCommentContainer"
import { Post } from "@/types/posts"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { EyeIcon, ThumbsUpIcon } from "lucide-react"
import { Separator } from "../ui/separator"

interface Props {
  post: Post
  deletePost: () => void
}

const PostDetailContainer = ({ post, deletePost }: Props) => {
  const filter = filters()
  const router = useRouter()
  const [isDeleteConfirmDialog, setIsDeleteConfirmDialog] = useState(false)
  const { data } = useSession()

  const { data: user } = useQuery({
    ...queries.users.detail(),
    enabled: !!data?.user,
  })

  return (
    <div className="mx-auto max-w-screen-lg px-4">
      <div className="mt-12 flex flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/posts" className="text-base">
                나눔
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-base">후기</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h2 className="break-keep text-[26px] md:text-[26px]">{post.title}</h2>
        <div className="flex gap-5 text-gray-400">
          <h6 className="text-sm font-normal md:mt-auto md:text-base">
            {filter.FROM_NOW_COMMENT(post.createdAt)}
          </h6>
          <button className="flex items-center gap-1 text-gray-300">
            <EyeIcon className="h-4 w-4" />
            <span className="">{post.viewCount}</span>
          </button>
          <button className="flex items-center gap-1 text-gray-300">
            <ThumbsUpIcon className="h-4 w-4" />
            <span className="">{post.likeCount}</span>
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Separator className="flex-1 bg-lightgray" />
        {user?.type === UserType.ADMIN && (
          <ItemManageBox
            handleEdit={() => router.push(`create?postId=${post.id}`)}
            handleDelete={() =>
              setIsDeleteConfirmDialog(!isDeleteConfirmDialog)
            }
            className="h-10 justify-end"
          />
        )}
      </div>

      <div
        className="editor_view ck-content font-medium tracking-wide md:break-keep md:text-lg"
        dangerouslySetInnerHTML={{
          __html: post.contents,
        }}
      />
      <CommentContainer />

      <ConfirmDialog
        isOpen={isDeleteConfirmDialog}
        handleDialog={() => setIsDeleteConfirmDialog(!isDeleteConfirmDialog)}
        title="커뮤니티 삭제"
        description="커뮤니티를 삭제하시겠습니까?"
        action={deletePost}
      />
    </div>
  )
}

export default PostDetailContainer
