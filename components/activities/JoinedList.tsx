import filters from "@/lib/filters"
import { queries } from "@/lib/queries"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import React from "react"
import { Loading } from "../common/Loading"
import { Button } from "@headlessui/react"
import { useRouter } from "next/navigation"

const JoinedList = () => {
  const filter = filters()
  const router = useRouter()

  const { data: session } = useSession()

  const { data: user, isLoading } = useQuery({
    ...queries.users.detail(),
    enabled: !!session?.user,
  })

  const { data: myApplyList } = useQuery({
    ...queries.jobs.myApplyList(user?.id as number, { page: 1, size: 10 }),
    enabled: !!user?.id,
  })

  const goToDetail = (id: number) => {
    router.push(`/jobs/part-time/${id}`)
  }

  //   if (isLoading || myApplyList?.jobs.length === 0) {
  //     return (
  //       <div className="text-grayFont my-6 text-center">데이터가 없습니다</div>
  //     )
  //   }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* {myApplyList?.jobs.map(job => <div key={job.id}>{job.title}</div>)} */}
      <div className="relative z-10 flex flex-col gap-4 rounded border border-lightgray p-4 shadow-md">
        <div className="absolute inset-0 z-20 rounded bg-gray-500/50"></div>
        <span>교회 오보에 대타 연주자 구합니다</span>

        <div className="flex items-center gap-4">
          <div className="rounded bg-main px-3 py-1 text-white">신청일</div>
          <p>{filter.YYYYMMDD("2024-10-19T23:00")}</p>
        </div>
        <div className="flex justify-end gap-4">
          <Button className="rounded border px-2 py-1 text-main">선발중</Button>
          <Button
            onClick={() => goToDetail(188)}
            className="rounded border px-2 py-1 text-main"
          >
            바로가기
          </Button>
        </div>
      </div>
    </div>
  )
}

export default JoinedList
