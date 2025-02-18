import filters from "@/lib/filters"
import { queries } from "@/lib/queries"
import { NEWS } from "@/types/news"
import { UserType } from "@/types/users"
import { useQuery } from "@tanstack/react-query"
import React, { Suspense, useState } from "react"
import ItemManageBox from "../common/ItemManageBox"
import { useRouter } from "next/navigation"
import ConfirmDialog from "../dialog/ConfirmDialog"
import { useSession } from "next-auth/react"
import CommentContainer from "../comments/CommentContainer"

interface Props {
  news: NEWS
  deleteNews: () => void
}

const NewsDetailContainer = ({ news, deleteNews }: Props) => {
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
      <div className="flex flex-col gap-4 md:gap-8">
        <h2 className="mt-28 break-keep text-center text-[26px] md:text-5xl">
          {news.title}
        </h2>
        <h6 className="text-center text-sm font-medium text-coolgray md:mt-auto md:text-base">
          {filter.YYYYMMDD(news.createdAt)}
        </h6>
      </div>

      {user?.type === UserType.ADMIN && (
        <ItemManageBox
          handleEdit={() => router.push(`create?newsId=${news.id}`)}
          handleDelete={() => setIsDeleteConfirmDialog(!isDeleteConfirmDialog)}
          className="my-8 h-10 justify-end"
        />
      )}

      <div
        className="editor_view ck-content mt-20 font-medium tracking-wide md:break-keep md:text-lg"
        dangerouslySetInnerHTML={{
          __html: news.contents,
        }}
      />
      <CommentContainer type="news" />

      <ConfirmDialog
        isOpen={isDeleteConfirmDialog}
        handleDialog={() => setIsDeleteConfirmDialog(!isDeleteConfirmDialog)}
        title="뉴스 삭제"
        description="채용을 삭제하시겠습니까?"
        action={deleteNews}
      />
    </div>
  )
}

export default NewsDetailContainer
