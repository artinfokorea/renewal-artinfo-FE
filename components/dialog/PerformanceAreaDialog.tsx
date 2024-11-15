import React, { Fragment, useEffect, useRef, useState } from "react"
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Input,
  Transition,
} from "@headlessui/react"
import CloseIcon from "../icons/CloseIcon"
import { useQuery } from "@tanstack/react-query"
import { queries } from "@/lib/queries"
import useDebounce from "@/hooks/useDebounce"
import { PERFORMANCE_AREA } from "@/types/performances"

interface Props {
  isOpen: boolean
  handleArea: (area: PERFORMANCE_AREA) => void
  handleDialog: () => void
}

const PerformanceAreaDialog = ({ isOpen, handleDialog, handleArea }: Props) => {
  const [keyword, setKeyword] = useState("")
  const [pageSize, setPageSize] = useState(10)
  const debouncedKeyword = useDebounce(keyword, 300)
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const [scrollPosition, setScrollPosition] = useState(0)

  const { data: areas } = useQuery({
    ...queries.performances.areas({
      page: 1,
      size: pageSize,
      keyword: debouncedKeyword,
    }),
    enabled: !!debouncedKeyword,
  })

  const selectArea = (area: PERFORMANCE_AREA) => {
    handleArea(area)
    handleDialog()
  }

  useEffect(() => {
    setKeyword("")
  }, [handleDialog])

  const hasNextPage =
    (areas?.performanceAreas?.length ?? 0) > 0 &&
    (areas?.performanceAreas?.length ?? 0) < (areas?.totalCount ?? 0)

  const handleLoadMore = () => {
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollTop)
    }
    setPageSize(pageSize + 10)
  }

  useEffect(() => {
    if (scrollContainerRef.current && scrollPosition > 0) {
      scrollContainerRef.current.scrollTop = scrollPosition
    }
  }, [areas])

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleDialog}>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-semibold leading-6 text-gray-900"
                  >
                    공연장 검색
                  </DialogTitle>
                  <button
                    type="button"
                    onClick={handleDialog}
                    className="text-grayfont"
                  >
                    <CloseIcon />
                  </button>
                </div>
                <form className="my-4" onSubmit={e => e.preventDefault()}>
                  <Input
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    className="w-full rounded-md border border-grayfont p-2 focus:outline-none"
                  />
                </form>
                <div
                  ref={scrollContainerRef}
                  className="h-[400px] overflow-y-auto"
                >
                  {areas?.performanceAreas.length === 0 ? (
                    <p className="py-4 text-center text-gray-500">
                      데이터가 없습니다.
                    </p>
                  ) : (
                    <>
                      {areas?.performanceAreas.map(area => (
                        <div
                          key={area.id}
                          className="flex items-center justify-between border-b border-gray-200 px-2 py-2"
                        >
                          <div>
                            <p className="text-gray-600">{area.name}</p>
                            <p className="text-sm text-gray-400">
                              {area.address}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => selectArea(area)}
                            className="whitespace-nowrap text-blue-600"
                          >
                            선택
                          </button>
                        </div>
                      ))}
                      {hasNextPage && (
                        <button
                          onClick={handleLoadMore}
                          className="w-full rounded border border-grayfont py-2 text-blue-600"
                        >
                          더보기
                        </button>
                      )}
                    </>
                  )}
                </div>
              </DialogPanel>
            </Transition>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default PerformanceAreaDialog
