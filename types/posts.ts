export enum PostCategory {
  REVIEW = "REVIEW",
  INQUIRY = "INQUIRY",
  ETC = "ETC",
}

export const PostCategoryLabel = {
  [PostCategory.REVIEW]: "후기",
  [PostCategory.INQUIRY]: "질문",
  [PostCategory.ETC]: "기타",
}

export interface Post {
  id: number
  authorId: number
  authorName: string
  authorIconImageUrl?: string
  category: PostCategory
  title: string
  contents: string
  thumbnailImageUrl: string
  viewCount: number
  likeCount: number
  commentCount: number
  isLiked: boolean
  createdAt: string
}
