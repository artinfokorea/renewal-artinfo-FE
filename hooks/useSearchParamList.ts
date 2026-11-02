import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

/**
 * URL 의 다중 값 파라미터(?provinceId=1&provinceId=2)를 읽고 바꾼다.
 * 필터 상태를 URL 에 두는 기존 방식(공유·북마크 가능)을 그대로 따른다.
 */
export const useSearchParamList = (key: string) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const values = searchParams.getAll(key)

  const set = useCallback(
    (next: string[]) => {
      const params = new URLSearchParams(searchParams.toString())
      params.delete(key)
      next.forEach(value => params.append(key, value))
      const query = params.toString()
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
    },
    [key, pathname, router, searchParams],
  )

  const toggle = useCallback(
    (value: string) => {
      set(
        values.includes(value)
          ? values.filter(v => v !== value)
          : [...values, value],
      )
    },
    [set, values],
  )

  const clear = useCallback(() => set([]), [set])

  return { values, set, toggle, clear }
}
