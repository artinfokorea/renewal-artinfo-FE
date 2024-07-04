import React, { FormEvent, useState } from "react"
import { Input } from "../ui/input"
import SearchIcon from "../icons/SearchIcon"
import CloseIcon from "../icons/CloseIcon"
import { usePathname, useRouter } from "next/navigation"

interface Props {
  totalCount?: number
  title?: string
}

const ListSearchForm = ({ totalCount, title }: Props) => {
  const [searchInput, setSearchInput] = useState("")
  const pathname = usePathname()
  const router = useRouter()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const searchParams = new URLSearchParams(window.location.search)

    searchParams.delete("keyword")
    searchInput && searchParams.append("keyword", searchInput)

    const newUrl = `${window.location.pathname}?${searchParams.toString()}`

    router.push(newUrl)
  }

  return (
    <div className="mx-auto mt-8 flex max-w-screen-sm flex-col items-center md:mt-20">
      <h4 className="text-lg font-bold md:text-2xl">
        <span className="text-main">{totalCount ?? "00"}</span>
        {title}
      </h4>
      <form className="relative mt-4 w-full" onSubmit={handleSubmit}>
        <Input
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          className="w-full rounded-3xl border-2 border-main px-14 text-base text-black placeholder-gray-400 md:py-6"
          placeholder="직군, 전공, 분야 등을 검색해보세요."
        />
        <button type="submit">
          <SearchIcon className="absolute left-5 top-[11px] h-5 w-5 text-gray-400 md:top-[14px] md:h-6 md:w-6" />
        </button>

        {searchInput && (
          <button
            type="button"
            onClick={() => setSearchInput("")}
            className="absolute right-3 top-[10px] md:top-[14px]"
          >
            <CloseIcon className="h-5 w-5 text-gray-400 md:h-6 md:w-6" />
          </button>
        )}
      </form>
    </div>
  )
}

export default ListSearchForm
