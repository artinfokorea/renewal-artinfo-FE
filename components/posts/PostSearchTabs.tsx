import React, { useState } from "react"
import { Button } from "../ui/button"
import { PostCategory, PostCategoryLabel } from "@/types/posts"
import { usePostFilterTab } from "@/hooks/usePostFilterTab"

export const PostSearchTabs = () => {
  const { selectedCategory, handleCategoryClick } = usePostFilterTab()

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() => handleCategoryClick("ALL")}
        className={`h-8 w-[65px] rounded-[25px] border border-main px-4 text-xs font-semibold ${selectedCategory === "ALL" ? "bg-main text-white" : "bg-white text-black"}`}
      >
        전체
      </Button>
      {Object.entries(PostCategoryLabel).map(([key, value]) => (
        <Button
          onClick={() => handleCategoryClick(key as PostCategory)}
          key={value}
          className={`h-8 w-[65px] rounded-[25px] border border-main px-4 text-xs font-semibold ${selectedCategory === key ? "bg-main text-white" : "bg-white text-black"}`}
        >
          {value}
        </Button>
      ))}
    </div>
  )
}
