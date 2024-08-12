import { CommentType } from "@/types/comments"

export interface CommentPayload {
  type: CommentType
  targetId: number
  parentId: number
  contents: string
}
