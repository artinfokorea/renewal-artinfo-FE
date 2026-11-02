"use client"

import React, { FormEvent, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import SearchIcon from "../icons/SearchIcon"
import CloseIcon from "../icons/CloseIcon"

interface Props {
  placeholder?: string
}

/** 목록 페이지 공용 검색창 — 검색어는 ?keyword= 로 URL 에 둔다 */
const SearchBar = ({ placeholder = "검색어를 입력해주세요" }: Props) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [input, setInput] = useState(searchParams.get("keyword") ?? "")

  const pushKeyword = (keyword: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("keyword")
    if (keyword) params.append("keyword", keyword)
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    pushKeyword(input.trim())
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="flex h-12 items-center gap-2.5 rounded-xl bg-[#F2F4F6] px-4 md:h-[52px] md:px-[18px]"
    >
      <SearchIcon className="h-5 w-5 shrink-0 text-coolgray" />
      <label htmlFor="list-search" className="sr-only">
        검색
      </label>
      <input
        id="list-search"
        type="search"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-base text-[#191F28] outline-none placeholder:text-coolgray [&::-webkit-search-cancel-button]:hidden"
      />
      {input && (
        <button
          type="button"
          aria-label="검색어 지우기"
          onClick={() => {
            setInput("")
            pushKeyword("")
          }}
          className="flex h-8 w-8 items-center justify-center text-coolgray"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      )}
    </form>
  )
}

export default SearchBar
