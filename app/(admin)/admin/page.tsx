"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { queries } from "@/lib/queries"
import filters from "@/lib/filters"
import { UserType } from "@/types/users"
import { AdminDailyMetric } from "@/types/admin"
import StatTile, { RecentDelta } from "@/components/admin/StatTile"
import DailyBarChart, { METRIC_LABEL } from "@/components/admin/DailyBarChart"
import BarList from "@/components/admin/BarList"
import RetentionTable from "@/components/admin/RetentionTable"
import VisitorList from "@/components/admin/VisitorList"
import AdminNav from "@/components/admin/AdminNav"
import { formatDuration } from "@/components/admin/format"

const RANGES = [7, 30, 90] as const
/** 콘텐츠 일별 지표 (로그인 기록 기반 지표는 방문자 활동으로 대체) */
const CONTENT_METRICS: AdminDailyMetric[] = ["signups", "jobs", "posts", "comments"]

type EngagementMetric = "visitors" | "members" | "avgSeconds"
const ENGAGEMENT_METRICS: EngagementMetric[] = ["visitors", "members", "avgSeconds"]
const ENGAGEMENT_LABEL: Record<EngagementMetric, string> = {
  visitors: "방문자",
  members: "회원 방문자",
  avgSeconds: "평균 체류시간",
}

const LOGIN_TYPE_LABEL: Record<string, string> = {
  EMAIL: "이메일",
  KAKAO: "카카오",
  NAVER: "네이버",
  GOOGLE: "구글",
  APPLE: "애플",
}

const Card = ({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) => (
  <section className="flex flex-col gap-4 rounded-2xl border border-[#EEF0F3] bg-white p-5">
    <div className="flex flex-col gap-1">
      <h2 className="text-base font-bold text-[#191F28]">{title}</h2>
      {description && <p className="text-[13px] text-[#8B95A1]">{description}</p>}
    </div>
    {children}
  </section>
)

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mt-10 text-lg font-bold text-[#191F28] first:mt-0">{children}</h2>
)

const Tabs = <T extends string | number>({
  label,
  items,
  value,
  onChange,
  render,
}: {
  label: string
  items: readonly T[]
  value: T
  onChange: (v: T) => void
  render: (v: T) => string
}) => (
  <div role="group" aria-label={label} className="flex flex-wrap gap-1.5">
    {items.map(item => (
      <button
        key={String(item)}
        type="button"
        aria-pressed={item === value}
        onClick={() => onChange(item)}
        className={`h-8 rounded-full border px-3 text-[13px] ${
          item === value
            ? "border-[#191F28] bg-[#191F28] font-bold text-white"
            : "border-[#E5E8EB] bg-white text-[#4E5968] hover:bg-[#F7F8FA]"
        }`}
      >
        {render(item)}
      </button>
    ))}
  </div>
)

const memberSub = (n?: number) => (
  <>
    회원 <strong className="font-semibold text-[#333D4B]">{n?.toLocaleString() ?? "–"}</strong>
  </>
)

/** 관리자 지표 대시보드 — 서버가 ADMIN 여부를 다시 확인한다 */
const AdminPage = () => {
  const filter = filters()
  const { data: session, status } = useSession()
  const { data: me, isLoading: meLoading } = useQuery({
    ...queries.users.detail(),
    enabled: !!session?.user,
  })
  const isAdmin = me?.type === UserType.ADMIN

  const [engagementDays, setEngagementDays] = useState<(typeof RANGES)[number]>(30)
  const [engagementMetric, setEngagementMetric] = useState<EngagementMetric>("visitors")
  const [days, setDays] = useState<(typeof RANGES)[number]>(30)
  const [metric, setMetric] = useState<AdminDailyMetric>("signups")

  const { data: overview, error: overviewError } = useQuery({
    ...queries.admin.overview(),
    enabled: isAdmin,
  })
  const { data: engagement } = useQuery({
    ...queries.admin.engagement(engagementDays),
    enabled: isAdmin,
  })
  const { data: daily } = useQuery({ ...queries.admin.daily(days), enabled: isAdmin })
  const { data: breakdown } = useQuery({ ...queries.admin.breakdown(), enabled: isAdmin })

  if (status === "loading" || meLoading) {
    return <div className="mx-auto max-w-[1040px] px-4 py-24 text-center text-coolgray">불러오는 중…</div>
  }

  if (isAdmin && overviewError) {
    return (
      <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-4 px-4 py-24 text-center">
        <h1 className="text-xl font-bold text-[#191F28]">지표를 불러오지 못했습니다</h1>
        <p className="text-sm text-[#6B7684]">잠시 후 다시 시도해 주세요.</p>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-4 px-4 py-24 text-center">
        <h1 className="text-xl font-bold text-[#191F28]">접근 권한이 없습니다</h1>
        <p className="text-sm text-[#6B7684]">관리자 계정으로 로그인해 주세요.</p>
        <Link href="/" className="text-sm font-bold text-main">
          홈으로
        </Link>
      </div>
    )
  }

  const s = engagement?.summary

  return (
    <div className="mx-auto max-w-[1040px] px-4 pt-6 md:px-6 md:pt-14">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-[#191F28] md:text-[28px]">관리자</h1>
        <span className="text-[13px] text-[#8B95A1]">한국 시간 기준</span>
      </div>
      <AdminNav />

      {/* 방문자 활동 */}
      <div className="mt-6 flex flex-col gap-4">
        <SectionTitle>방문자 활동 (비회원 포함)</SectionTitle>
        <section aria-label="방문자 요약" className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatTile label="오늘 방문자 (DAU)" value={s?.dau} sub={memberSub(s?.memberDau)} />
          <StatTile label="7일 방문자 (WAU)" value={s?.wau} sub={memberSub(s?.memberWau)} />
          <StatTile label="30일 방문자 (MAU)" value={s?.mau} sub={memberSub(s?.memberMau)} />
          <div className="flex flex-col gap-1.5 rounded-2xl border border-[#EEF0F3] bg-white p-4 md:p-5">
            <span className="text-[13px] font-medium text-[#6B7684]">평균 체류시간 (7일)</span>
            <span className="text-2xl font-bold tabular-nums tracking-tight text-[#191F28] md:text-[28px]">
              {s ? formatDuration(s.avgSeconds7d) : "–"}
            </span>
            <span className="text-[13px] text-[#6B7684]">방문자 1명·하루 기준</span>
          </div>
        </section>

        <Card title="방문 추이" description="10초 이상 머물렀거나 2페이지 이상 본 방문만 셉니다 (GA4 참여 기준). 체류시간은 탭이 화면에 보인 시간입니다.">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <Tabs
              label="방문 지표"
              items={ENGAGEMENT_METRICS}
              value={engagementMetric}
              onChange={setEngagementMetric}
              render={m => ENGAGEMENT_LABEL[m]}
            />
            <Tabs label="기간" items={RANGES} value={engagementDays} onChange={setEngagementDays} render={d => `${d}일`} />
          </div>
          {engagement ? (
            <DailyBarChart
              points={engagement.daily}
              valueKey={engagementMetric}
              label={ENGAGEMENT_LABEL[engagementMetric]}
              format={engagementMetric === "avgSeconds" ? formatDuration : undefined}
              summary={engagementMetric === "avgSeconds" ? "average" : "sum"}
            />
          ) : (
            <div className="h-[200px] animate-pulse rounded-xl bg-[#F7F8FA]" />
          )}
        </Card>

        <Card
          title="주간 리텐션"
          description="그 주에 처음 온 방문자 중 1~4주 뒤 다시 온 비율. 같은 브라우저 기준입니다."
        >
          <RetentionTable cohorts={engagement?.retention ?? []} />
        </Card>

        <Card
          title="방문자 목록"
          description="그날 들어온 브라우저 한 개가 한 줄입니다. 기기 정보에 마우스를 올리면 User-Agent 원문이 보입니다. '미참여'는 10초 미만·1페이지만 본 방문으로 지표에서 빠집니다."
        >
          <VisitorList />
        </Card>
      </div>

      {/* 회원·콘텐츠 */}
      <div className="mt-4 flex flex-col gap-4">
        <SectionTitle>회원·콘텐츠</SectionTitle>
        <section aria-label="콘텐츠 요약" className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatTile
            label="회원"
            value={overview?.users.total}
            sub={<RecentDelta last7d={overview?.users.last7d} last30d={overview?.users.last30d} />}
          />
          <StatTile
            label="채용 공고"
            value={overview?.jobs.total}
            sub={<RecentDelta last7d={overview?.jobs.last7d} last30d={overview?.jobs.last30d} />}
          />
          <StatTile
            label="나눔 글"
            value={overview?.posts.total}
            sub={<RecentDelta last7d={overview?.posts.last7d} last30d={overview?.posts.last30d} />}
          />
          <StatTile
            label="댓글"
            value={overview?.comments.total}
            sub={<>7일 <strong className="font-semibold text-[#333D4B]">+{overview?.comments.last7d?.toLocaleString() ?? "–"}</strong></>}
          />
          <StatTile label="레슨" value={overview?.lessons} />
          <StatTile
            label="공연 (종료 전)"
            value={overview?.upcomingPerformances}
            sub={<>전체 {overview?.performances?.toLocaleString() ?? "–"}</>}
          />
          <StatTile label="뉴스" value={overview?.news} />
          <StatTile
            label="문의"
            value={overview?.inquiries.total}
            sub={<>30일 <strong className="font-semibold text-[#333D4B]">+{overview?.inquiries.last30d?.toLocaleString() ?? "–"}</strong></>}
          />
        </section>

        <Card title="콘텐츠 일별 추이">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <Tabs label="지표" items={CONTENT_METRICS} value={metric} onChange={setMetric} render={m => METRIC_LABEL[m]} />
            <Tabs label="기간" items={RANGES} value={days} onChange={setDays} render={d => `${d}일`} />
          </div>
          {daily ? (
            <DailyBarChart points={daily.points} valueKey={metric} label={METRIC_LABEL[metric]} />
          ) : (
            <div className="h-[200px] animate-pulse rounded-xl bg-[#F7F8FA]" />
          )}
        </Card>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card title="로그인 방식 (최근 30일 사용자)">
            <BarList
              items={(breakdown?.loginsByType ?? []).map(i => ({
                label: LOGIN_TYPE_LABEL[i.type] ?? i.type,
                count: i.count,
              }))}
            />
          </Card>
          <Card title="최근 가입">
            <ul className="flex flex-col divide-y divide-[#F2F4F6]">
              {breakdown?.recentUsers.map(u => (
                <li key={u.id} className="flex items-baseline justify-between gap-3 py-2 text-sm">
                  <span className="min-w-0 truncate text-[#191F28]">
                    {u.nickname}
                    <span className="ml-1.5 text-[12px] text-[#8B95A1]">{u.email}</span>
                  </span>
                  <span className="shrink-0 text-[12px] text-[#8B95A1]">{filter.FROM_NOW_COMMENT(u.createdAt)}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card title="인기 나눔 글 (30일)">
            <ul className="flex flex-col divide-y divide-[#F2F4F6]">
              {breakdown?.topPosts.length === 0 && <li className="py-2 text-sm text-coolgray">글이 없습니다.</li>}
              {breakdown?.topPosts.map(p => (
                <li key={p.id} className="py-2 text-sm">
                  <Link href={`/posts/${p.id}`} className="flex items-baseline justify-between gap-3 hover:text-main">
                    <span className="min-w-0 truncate">{p.title}</span>
                    <span className="shrink-0 tabular-nums text-[12px] text-[#8B95A1]">조회 {p.viewCount.toLocaleString()}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
          <Card title="최근 문의">
            <ul className="flex flex-col divide-y divide-[#F2F4F6]">
              {breakdown?.recentInquiries.length === 0 && <li className="py-2 text-sm text-coolgray">문의가 없습니다.</li>}
              {breakdown?.recentInquiries.map(i => (
                <li key={i.id} className="flex flex-col gap-0.5 py-2 text-sm">
                  <span className="truncate text-[#191F28]">{i.title}</span>
                  <span className="text-[12px] text-[#8B95A1]">
                    {i.email} · {filter.FROM_NOW_COMMENT(i.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
