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

const KakaoMap = dynamic(() => import("@/components/common/KakaoMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  ),
})

const PerformanceDetailContainer = () => {
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

  const detailItems = [
    {
      title: "공연기간",
      content: "2024.10.06(일) ~ 2024.10.06(일)",
    },
    {
      title: "공연장소",
      content: "예술의전당 [서울] 콘서트홀",
    },
    {
      title: "공연시간",
      content: "일요일(17:00)",
    },
    {
      title: "관람연령",
      content: "만 7세 이상",
    },
    {
      title: "티켓가격",
      content: "R석 110,000원 / S석 90,000원 / A석 70,000원",
    },
    {
      title: "출연진",
      content: "손열음",
    },
    {
      title: "주관-주최",
      content: "(주)파이플랜즈 (pie plans)",
    },
  ]

  const eventInfo = [
    {
      title: "좌석수",
      content: "2505석",
    },
    {
      title: "시설특성",
      content: "국립",
    },
    {
      title: "주소",
      content: "서울특별시 서초구 남부순환로 2406(서초동)",
    },
    {
      title: "홈페이지",
      content: "www.sac.or.kr",
    },
  ]

  return (
    <div className="mt-8 px-4 md:mt-16">
      <h2 className="my-4 text-center text-xl md:text-left md:text-2xl">
        손열음 피아노 리사이틀
      </h2>
      <div className="flex flex-col md:flex-row md:gap-12">
        {/* {lesson?.imageUrl && (
          <div className="relative mx-auto h-[320px] w-[240px] md:h-[300px] md:w-[220px]">
            <FallbackImage
              src={lesson?.imageUrl}
              alt="lesson_image"
              fill
              priority
              quality={100}
              className="rounded-md"
              sizes="(max-width: 768px) 100px 180px, (max-width: 1200px) 200px, 200px"
            />
          </div>
        )} */}
        <div className="relative mx-auto h-[320px] w-[240px] md:mx-0 md:h-[300px] md:w-[220px]">
          <FallbackImage
            src="https://artinfo.s3.ap-northeast-2.amazonaws.com/prod/upload/1710/images/20240806/original/v8ofDoqEE16.1722905864785.png"
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

        {/* {user?.id === job?.authorId ? (
          <div className="my-8 flex h-8 items-center gap-4 md:gap-6">
            <div className="w-full flex-1 border-b-2 border-whitesmoke" />
            <ItemManageBox
              handleEdit={() =>
                router.push(`${pathname}?type=edit&jobType=${job?.type}`)
              }
              handleDelete={() =>
                setIsDeleteConfirmDialog(!isDeleteConfirmDialog)
              }
              className="h-10"
            />
          </div>
        ) : job?.recruitSiteUrl ? (
          <div className="my-8 flex items-center justify-center">
            <div className="flex-1 border-b-2 border-whitesmoke"></div>
            <a
              href={job?.recruitSiteUrl}
              target="_blank"
              className="mx-4 hidden text-base font-bold text-main md:inline md:text-lg"
            >
              예매처 바로가기
            </a>
            <div className="flex-1 border-b-2 border-whitesmoke"></div>
          </div>
        ) : (
          <div className="my-8 flex flex-1 border-b-2 border-whitesmoke" />
        )} */}
      </div>
      <TabGroup
        className="my-8"
        selectedIndex={selectedIndex}
        onChange={setSelectedIndex}
      >
        <TabList className="grid grid-cols-2 rounded border-2 border-whitesmoke">
          <Tab className="py-2 text-sm text-main data-[selected]:bg-whitesmoke md:text-base">
            소개
          </Tab>
          <Tab className="py-2 text-sm text-main data-[selected]:bg-whitesmoke md:text-base">
            공연장
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            1
            {/* {job?.contents && (
        <div
          className="editor_view ck-content"
          dangerouslySetInnerHTML={{
            __html: job?.contents,
          }}
        />
      )} */}
          </TabPanel>
          <TabPanel className="py-8">
            <h4 className="font-semibold md:text-lg">
              예술의전당 [서울]콘서트홀
            </h4>

            <div className="my-8 flex flex-col gap-3 text-sm md:text-base">
              {eventInfo.map(({ title, content }) => (
                <div className="flex" key={title}>
                  <span className="basis-1/4 font-semibold text-grey md:basis-1/6">
                    {title}
                  </span>
                  <span className="basis-3/4">{content}</span>
                </div>
              ))}
            </div>
            <KakaoMap />
          </TabPanel>
        </TabPanels>
      </TabGroup>

      {/* <ConfirmDialog
        isOpen={isDeleteConfirmDialog}
        handleDialog={() => setIsDeleteConfirmDialog(!isDeleteConfirmDialog)}
        title="공연 삭제"
        description="공연을 삭제하시겠습니까?"
        action={deleteLesson}
      /> */}
    </div>
  )
}

export default PerformanceDetailContainer
