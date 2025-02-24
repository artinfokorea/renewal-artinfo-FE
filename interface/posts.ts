import { PostCategory } from "@/types/posts"
import { ListRequest } from "."

export interface PostsRequest extends ListRequest {
  category?: PostCategory
}

export interface PostPayload {
  title: string
  contents: string
  category: PostCategory
  thumbnailImageUrl?: string
}
