import filters from "@/lib/filters"
import { NEWS } from "@/types/news"
import { usePathname } from "next/navigation"
import React, { forwardRef } from "react"
interface Props {
  news: NEWS
  isLastPage: boolean
}

const NewsCard = forwardRef<HTMLDivElement, Props>(
  ({ news, isLastPage }, ref) => {
    const pathname = usePathname()
    const filter = filters()
    return <div>hihi</div>
  },
)

export default NewsCard
