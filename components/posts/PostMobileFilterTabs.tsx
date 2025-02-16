import { usePostFilterTab } from "@/hooks/usePostFilterTab"
import { PostCategory, PostCategoryLabel } from "@/types/posts"

export const PostMobileFilterTabs = () => {
  const { isMobileFilterOpen, handleIsMobileFilterOpen, handleCategoryClick } =
    usePostFilterTab()

  return (
    <div className="relative mx-4 flex flex-col rounded border lg:hidden">
      <div className={`grid grid-cols-2 text-sm text-main`}>
        <button
          onClick={() => handleIsMobileFilterOpen()}
          className={`rounded py-2 ${isMobileFilterOpen && "bg-whitesmoke"}`}
        >
          나눔
        </button>
        <button className={`rounded py-2`}>Top Author</button>
      </div>
      {isMobileFilterOpen && (
        <div className="flex flex-col gap-1 px-2 py-4">
          <button
            onClick={() => handleCategoryClick("ALL")}
            className="rounded-lg px-4 py-2 text-left font-semibold text-coolgray"
          >
            전체
          </button>
          {Object.entries(PostCategoryLabel).map(([key, value]) => (
            <button
              key={key}
              onClick={() => handleCategoryClick(key as PostCategory)}
              className="rounded-lg px-4 py-2 text-left font-semibold text-coolgray"
            >
              {value}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
