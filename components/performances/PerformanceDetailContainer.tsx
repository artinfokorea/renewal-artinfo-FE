import React, { useEffect, useState } from "react"
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
import DOMPurify from "dompurify"

const KakaoMap = dynamic(() => import("@/components/common/KakaoMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] items-center justify-center">
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
  const [parsedContent, setParsedContent] = useState("")
  const { data } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const filter = filters()

  const { data: user } = useQuery({
    ...queries.users.detail(),
    enabled: !!data?.user,
  })

  useEffect(() => {
    const parseContent = async () => {
      if (typeof window !== "undefined") {
        const parser = new DOMParser()
        const doc = parser.parseFromString(
          performance.introduction,
          "text/html",
        )
        doc.querySelectorAll("img").forEach(img => {
          img.src = img.src.replace(/^http:\/\//i, "https://")
        })
        const result = DOMPurify.sanitize(doc.body.innerHTML)
        setParsedContent(result)
      }
    }
    parseContent()
  }, [performance.introduction])

  const detailItems = [
    {
      title: "공연기간",
      content: `${filter.YYYYMMDD(performance.startAt, "YYYY.MM.DD (ddd)")} ~ ${filter.YYYYMMDD(
        performance.endAt,
        "YYYY.MM.DD (ddd)",
      )}`,
    },
    {
      title: "공연장소",
      content: performance.customAreaName || performance.area?.name,
    },
    {
      title: "공연시간",
      content: performance.time,
    },
    {
      title: "관람연령",
      content: performance.age,
    },
    {
      title: "티켓가격",
      content: performance.ticketPrice,
    },
    {
      title: "출연진",
      content: performance.cast,
    },
    {
      title: "주관-주최",
      content: performance.host,
    },
  ]

  const eventInfo = [
    {
      title: "좌석수",
      content: `${performance.area?.seatScale}석`,
    },
    {
      title: "시설특성",
      content: performance.area?.type,
    },
    {
      title: "주소",
      content: performance.area?.address,
    },
    {
      title: "홈페이지",
      content: performance.area?.siteUrl,
    },
  ]

  return (
    <div className="mt-8 px-4 md:mt-16">
      <h2 className="my-4 text-center text-xl md:text-left md:text-2xl">
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
        <div className="my-4 flex flex-1 flex-col gap-3 text-sm md:text-base">
          {detailItems.map(({ title, content }) => (
            <div className="flex" key={title}>
              <span className="basis-1/4 font-semibold text-grey md:basis-1/6">
                {title}
              </span>
              <span className="basis-3/4 font-medium">{content}</span>
            </div>
          ))}
        </div>
      </div>
      {user?.id === performance.authorId ? (
        <div className="my-8 flex h-8 items-center gap-4 md:gap-6">
          <div className="w-full flex-1 border-b-2 border-whitesmoke" />
          <ItemManageBox
            handleEdit={() => router.push(`${pathname}?type=edit`)}
            handleDelete={() =>
              setIsDeleteConfirmDialog(!isDeleteConfirmDialog)
            }
            className="h-10"
          />
        </div>
      ) : performance?.reservationUrl ? (
        <div className="my-8 flex items-center justify-center">
          <div className="flex-1 border-b-2 border-whitesmoke"></div>
          <a
            href={performance?.reservationUrl}
            target="_blank"
            className="mx-4 hidden text-base font-bold text-main md:inline md:text-lg"
          >
            예매처 바로가기
          </a>
          <div className="flex-1 border-b-2 border-whitesmoke"></div>
        </div>
      ) : (
        <div className="my-8 flex flex-1 border-b-2 border-whitesmoke" />
      )}
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
              `py-2 text-sm active:outline-none md:text-base ${selected ? "border-t-2 border-main bg-white text-main" : "bg-whitesmoke text-black"}`
            }
          >
            소개
          </Tab>
          {performance.area && (
            <Tab
              className={({ selected }) =>
                `py-2 text-sm active:outline-none md:text-base ${selected ? "border-t-2 border-main bg-white text-main" : "bg-whitesmoke text-black"}`
              }
            >
              공연장
            </Tab>
          )}
        </TabList>
        <TabPanels>
          <TabPanel>
            {performance?.introduction && (
              <div
                className="editor_view ck-content"
                dangerouslySetInnerHTML={{
                  __html: parsedContent,
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
                {eventInfo.map(({ title, content }) => (
                  <div className="flex" key={title}>
                    <span className="basis-1/6 font-semibold text-grey">
                      {title}
                    </span>
                    <span className="basis-5/6">{content}</span>
                  </div>
                ))}
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