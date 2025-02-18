import { CommentType } from "@/types/comments"
import { ListRequest } from "."

export interface CommentPayload {
  type?: CommentType
  targetId?: number
  parentId?: number
  contents: string
}

export interface CommentsRequest extends ListRequest {
  newsId: number
  parentId?: number
}

export interface PostCommentsRequest extends ListRequest {
  postId: number
  parentId?: number
}
