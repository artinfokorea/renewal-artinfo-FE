import React, { useState } from "react"
import ConfirmDialog from "../dialog/ConfirmDialog"
import { useQuery } from "@tanstack/react-query"
import { queries } from "@/lib/queries"
import { useSession } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import filters from "@/lib/filters"
import FallbackImage from "../common/FallbackImage"
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react"
import ItemManageBox from "../common/ItemManageBox"
import dynamic from "next/dynamic"
import { Spinner } from "../common/Loading"
import { PERFORMANCE_DETAIL } from "@/types/performances"
import PerformanceDetailItem from "./PerformanceDetailItem"
import PerformanceAreaItem from "./PerformanceAreaItem"

const KakaoMap = dynamic(() => import("@/components/common/KakaoMap"), {
  ssr: false,
  loading: () => (
    <div className="flex aspect-[9/4] items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  ),
})

interface Props {
  performance: PERFORMANCE_DETAIL
  deletePerformance: () => void
}

const PerformanceDetailContainer = ({
  performance,
  deletePerformance,
}: Props) => {
  const [isDeleteConfirmDialog, setIsDeleteConfirmDialog] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const { data } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const filter = filters()

  const { data: user } = useQuery({
    ...queries.users.detail(),
    enabled: !!data?.user,
  })

  return (
    <div className="mt-8 px-4 md:mt-16">
      <h2 className="my-8 text-center text-xl md:text-left md:text-2xl">
        {performance.title}
      </h2>
      <div className="flex flex-col md:flex-row md:gap-12">
        <div className="relative mx-auto h-[320px] w-[240px] md:mx-0 md:h-[300px] md:w-[220px]">
          <FallbackImage
            src={performance.posterImageUrl}
            fallbackSrc="/img/metadata_image.png"
            alt="event_image"
            fill
            priority
            quality={100}
            className="rounded-md"
            sizes="(max-width: 768px) 100px 180px, (max-width: 1200px) 200px, 200px"
          />
        </div>
        <div className="my-8 flex flex-1 flex-col gap-3 text-sm md:my-4 md:text-base">
          <PerformanceDetailItem
            title="공연기간"
            content={`${filter.YYYYMMDD(performance.startAt, "YYYY.MM.DD (ddd)")} ~ ${filter.YYYYMMDD(
              performance.endAt,
              "YYYY.MM.DD (ddd)",
            )}`}
          />
          <PerformanceDetailItem
            title="공연장소"
            content={
              (performance.customAreaName || performance.area?.name) as string
            }
          />
          <PerformanceDetailItem title="공연시간" content={performance.time} />
          <PerformanceDetailItem title="관람연령" content={performance.age} />
          <PerformanceDetailItem
            title="티켓가격"
            content={performance.ticketPrice}
          />
          <PerformanceDetailItem title="출연진" content={performance.cast} />
          <PerformanceDetailItem
            title="주관 ∙ 주최"
            content={performance.host}
          />
        </div>
      </div>
      <div className="my-8 flex items-center justify-between">
        <div className="flex-1 border-b-2 border-whitesmoke" />

        {performance?.reservationUrl && (
          <a
            href={performance.reservationUrl}
            target="_blank"
            className="mx-4 text-base font-bold text-main md:text-lg"
          >
            예매처 바로가기
          </a>
        )}
        <div className="flex-1 border-b-2 border-whitesmoke" />
        {user?.id === performance.authorId && (
          <ItemManageBox
            handleEdit={() => router.push(`${pathname}?type=edit`)}
            handleDelete={() =>
              setIsDeleteConfirmDialog(!isDeleteConfirmDialog)
            }
            className="mx-4 h-10"
          />
        )}
      </div>
      <TabGroup
        className="my-8"
        selectedIndex={selectedIndex}
        onChange={setSelectedIndex}
      >
        <TabList
          className={`grid rounded border border-whitesmoke font-medium ${performance.area && "grid-cols-2"} `}
        >
          <Tab
            className={({ selected }) =>
              `py-2 text-sm focus:outline-none md:text-base ${selected ? "border-t-2 border-main bg-white text-main" : "bg-whitesmoke text-black"}`
            }
          >
            소개
          </Tab>
          {performance.area && (
            <Tab
              className={({ selected }) =>
                `py-2 text-sm focus:outline-none md:text-base ${selected ? "border-t-2 border-main bg-white text-main" : "bg-whitesmoke text-black"}`
              }
            >
              공연장
            </Tab>
          )}
        </TabList>
        <TabPanels>
          <TabPanel className="py-8">
            {performance?.introduction && (
              <div
                className="editor_view ck-content"
                dangerouslySetInnerHTML={{
                  __html: performance.introduction,
                }}
              />
            )}
          </TabPanel>
          {performance.area && (
            <TabPanel className="py-8">
              <h4 className="font-semibold md:text-lg">
                {performance.area?.name}
              </h4>

              <div className="my-8 flex flex-col gap-3 text-sm md:text-base">
                <PerformanceAreaItem
                  title="좌석수"
                  content={`${performance.area?.seatScale}석`}
                />
                <PerformanceAreaItem
                  title="시설특성"
                  content={performance.area?.type}
                />
                <PerformanceAreaItem
                  title="주소"
                  content={performance.area?.address}
                />
                <PerformanceAreaItem
                  title="홈페이지"
                  content={performance.area?.siteUrl}
                />
              </div>
              <div className="aspect-[9/4]">
                <KakaoMap
                  label={performance.customAreaName || performance.area.name}
                  latitude={performance.area.latitude}
                  longitude={performance.area.longitude}
                />
              </div>
            </TabPanel>
          )}
        </TabPanels>
      </TabGroup>
      <ConfirmDialog
        isOpen={isDeleteConfirmDialog}
        handleDialog={() => setIsDeleteConfirmDialog(!isDeleteConfirmDialog)}
        title="공연 삭제"
        description="공연을 삭제하시겠습니까?"
        action={deletePerformance}
      />
    </div>
  )
}

export default PerformanceDetailContainer
