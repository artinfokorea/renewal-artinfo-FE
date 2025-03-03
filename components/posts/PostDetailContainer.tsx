import filters from "@/lib/filters"
import { queries } from "@/lib/queries"
import { UserType } from "@/types/users"
import { useQuery } from "@tanstack/react-query"
import React, { useState } from "react"
import ItemManageBox from "../common/ItemManageBox"
import { useRouter } from "next/navigation"
import ConfirmDialog from "../dialog/ConfirmDialog"
import { useSession } from "next-auth/react"
import CommentContainer from "../comments/CommentContainer"
import { Post } from "@/types/posts"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Clock5Icon,
  EyeIcon,
  MessageCircle,
  ThumbsUpIcon,
  UserCircle,
} from "lucide-react"
import { Separator } from "../ui/separator"
import { PostThumbsUpButton } from "./PostThumbsUpButton"

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
    <div className="mx-auto max-w-screen-lg px-4 pb-40">
      <div className="mt-4 flex flex-col gap-4">
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
        <h2 className="break-all text-[26px] md:text-[26px]">{post.title}</h2>
        <div className="flex gap-5 font-medium text-gray-400">
          <div className="flex items-center gap-1">
            <Clock5Icon className="h-4 w-4" />
            <h6 className="text-sm font-normal md:mt-auto md:text-base">
              {filter.FROM_NOW_COMMENT(post.createdAt)}
            </h6>
          </div>
          <button className="flex items-center gap-1 text-sm text-gray-400 md:text-base">
            <EyeIcon className="h-5 w-5" />
            <span className="">{post.viewCount}</span>
          </button>
          <button className="flex items-center gap-1 text-sm text-gray-400 md:text-base">
            <UserCircle className="h-4 w-4" />
            {post.authorName}
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Separator className="flex-1 bg-lightgray" />
        {user?.id === post.authorId && (
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
        className="editor_view ck-content my-8 font-medium tracking-wide md:break-keep md:text-lg"
        dangerouslySetInnerHTML={{
          __html: post.contents,
        }}
      />

      <div className="mt-6 flex items-center space-x-5 font-light">
        <PostThumbsUpButton
          postId={post.id}
          isLiked={post.isLiked}
          likeCount={post.likeCount}
          isList={false}
        />
        <button className="flex items-center gap-1 text-gray-700">
          <MessageCircle className="h-4 w-4" />
          <span className="text-sm font-normal md:text-base">
            {post.commentCount}
          </span>
        </button>
      </div>

      <CommentContainer type="post" />

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
