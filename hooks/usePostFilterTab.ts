import { PostCategory } from "@/types/posts"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export const usePostFilterTab = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const category = searchParams.get("category") as PostCategory
  const [selectedCategory, setSelectedCategory] = useState<
    PostCategory | "ALL"
  >(category || "ALL")

  const handleIsMobileFilterOpen = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen)
  }

  const handleCategoryClick = (category: PostCategory | "ALL") => {
    setSelectedCategory(category)
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.delete("category")

    if (category !== "ALL") searchParams.append("category", category)

    setIsMobileFilterOpen(false)

    router.push(`${window.location.pathname}?${searchParams.toString()}`)
  }

  return {
    isMobileFilterOpen,
    handleIsMobileFilterOpen,
    selectedCategory,
    handleCategoryClick,
  }
}
