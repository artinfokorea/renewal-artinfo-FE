import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import CommentMenuButton from "../common/CommentMenuButton"
import useToast from "@/hooks/useToast"

interface Props {
  isAuthor: boolean
  isOpen: boolean
  handleDialog: () => void
  handleDelete: () => void
  handleEdit: () => void
  handleReply: () => void
}

const CommentMobileMenu = ({
  isAuthor,
  handleDelete,
  handleEdit,
  handleReply,
  handleDialog,
  isOpen,
}: Props) => {
  const { successToast } = useToast()

  return (
    <Dialog open={isOpen} onOpenChange={handleDialog}>
      <DialogContent className="mobile-comment-menu w-[300px] rounded-md px-6 py-4">
        <DialogHeader>
          <DialogTitle className="mx-auto w-16 rounded-full border-b-4 border-dimgray" />
          <DialogDescription className="flex flex-col">
            <CommentMenuButton
              label="답글"
              action={() => {
                handleDialog()
                handleReply()
              }}
            />
            {isAuthor ? (
              <>
                <CommentMenuButton
                  label="수정"
                  action={() => {
                    handleDialog()
                    handleEdit()
                  }}
                />
                <CommentMenuButton
                  label="삭제"
                  action={() => {
                    handleDialog()
                    handleDelete()
                  }}
                />
              </>
            ) : (
              <CommentMenuButton
                label="신고"
                action={() => {
                  handleDialog()
                  successToast("신고가 접수되었습니다.")
                }}
              />
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default CommentMobileMenu
