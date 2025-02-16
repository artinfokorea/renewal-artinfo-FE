import { PostCategory } from "@/types/posts"
import { ListRequest } from "."

export interface PostsRequest extends ListRequest {
  category?: PostCategory
}
