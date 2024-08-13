export enum CommentType {
  NEWS = "NEWS",
}

export type COMMENT = {
  id: number
  userId: number
  contents: string
  userNickname?: string
  userIconImageUrl?: string
  createdAt: Date
  childrenCount: number
}
