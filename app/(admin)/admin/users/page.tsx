"use client"

import React, { Suspense, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { queries } from "@/lib/queries"
import { UserType } from "@/types/users"
import { AdminUser, AdminUserFilter, AdminUsersParams } from "@/types/admin"
import { updateAdminUserType, withdrawAdminUser } from "@/services/admin"
import StatTile from "@/components/admin/StatTile"
import AdminNav from "@/components/admin/AdminNav"
import UsersTable from "@/components/admin/UsersTable"
import Pagination from "@/components/admin/Pagination"
import ConfirmDialog from "@/components/dialog/ConfirmDialog"
import useDebounce from "@/hooks/useDebounce"
import useToast from "@/hooks/useToast"

const FILTERS: { value: AdminUserFilter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "app", label: "앱 설치" },
  { value: "web", label: "웹만" },
  { value: "push_on", label: "채용 알림 켬" },
  { value: "push_off", label: "채용 알림 끔" },
  { value: "admin", label: "관리자" },
  { value: "withdrawn", label: "탈퇴" },
]
const FILTER_VALUES = FILTERS.map(f => f.value)
const SIZES = [20, 50, 100] as const
const DEFAULT_SIZE = 20

type PendingAction = { kind: "type"; user: AdminUser; type: "ADMIN" | "CLIENT" } | { kind: "withdraw"; user: AdminUser }

const Card = ({ children }: { children: React.ReactNode }) => (
  <section className="flex flex-col gap-4 rounded-2xl border border-[#EEF0F3] bg-white p-5">{children}</section>
)

const strong = (n?: number) => <strong className="font-semibold text-[#333D4B]">{n?.toLocaleString() ?? "–"}</strong>

/** 관리자 — 회원 관리. 필터·검색·페이지는 URL 쿼리로 들고 다닌다 (공유·새로고침 유지) */
const AdminUsersContent = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const { successToast, errorToast } = useToast()

  const { data: session, status } = useSession()
  const { data: me, isLoading: meLoading } = useQuery({
    ...queries.users.detail(),
    enabled: !!session?.user,
  })
  const isAdmin = me?.type === UserType.ADMIN

  /* URL → 상태 */
  const rawFilter = searchParams.get("filter") ?? "all"
  const filter: AdminUserFilter = (FILTER_VALUES as string[]).includes(rawFilter) ? (rawFilter as AdminUserFilter) : "all"
  const q = searchParams.get("q") ?? ""
  const page = Math.max(1, Number(searchParams.get("page")) || 1)
  const rawSize = Number(searchParams.get("size"))
  const size = (SIZES as readonly number[]).includes(rawSize) ? rawSize : DEFAULT_SIZE

  const setParams = (next: Partial<{ filter: AdminUserFilter; q: string; page: number; size: number }>) => {
    const params = new URLSearchParams(searchParams.toString())
    const merged = { filter, q, page, size, ...next }
    if (merged.filter === "all") params.delete("filter")
    else params.set("filter", merged.filter)
    if (merged.q) params.set("q", merged.q)
    else params.delete("q")
    if (merged.page > 1) params.set("page", String(merged.page))
    else params.delete("page")
    if (merged.size !== DEFAULT_SIZE) params.set("size", String(merged.size))
    else params.delete("size")
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  /* 검색 입력은 디바운스 후 URL 에 반영 (페이지 1로) */
  const [keyword, setKeyword] = useState(q)
  const debounced = useDebounce(keyword.trim(), 300)
  useEffect(() => {
    if (debounced !== q) setParams({ q: debounced, page: 1 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced])
  useEffect(() => {
    setKeyword(q)
  }, [q])

  const listParams: AdminUsersParams = useMemo(() => ({ filter, q, page, size }), [filter, q, page, size])

  const { data: summary } = useQuery({ ...queries.admin.usersSummary(), enabled: isAdmin })
  const {
    data: list,
    isFetching,
    error: listError,
  } = useQuery({
    ...queries.admin.users(listParams),
    enabled: isAdmin,
    placeholderData: previous => previous,
  })

  /* 작업: 역할 변경 · 탈퇴 처리 */
  const [pending, setPending] = useState<PendingAction | null>(null)
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: queries.admin.users._def })
    queryClient.invalidateQueries({ queryKey: queries.admin.usersSummary._def })
  }
  const mutation = useMutation({
    mutationFn: async (action: PendingAction) => {
      if (action.kind === "type") await updateAdminUserType(action.user.id, action.type)
      else await withdrawAdminUser(action.user.id)
      return action
    },
    onSuccess: action => {
      if (action.kind === "type") {
        successToast(action.type === "ADMIN" ? `${action.user.nickname} 님을 관리자로 지정했습니다.` : `${action.user.nickname} 님의 관리자 권한을 해제했습니다.`)
      } else {
        successToast(`${action.user.nickname} 님을 탈퇴 처리했습니다.`)
      }
      refresh()
    },
    onError: (error: any) => {
      errorToast(error?.response?.data?.message ?? error?.message ?? "처리하지 못했습니다.")
    },
    onSettled: () => setPending(null),
  })

  if (status === "loading" || meLoading) {
    return <div className="mx-auto max-w-[1040px] px-4 py-24 text-center text-coolgray">불러오는 중…</div>
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

  const dialog = pending && {
    title: pending.kind === "withdraw" ? "탈퇴 처리할까요?" : pending.type === "ADMIN" ? "관리자로 지정할까요?" : "관리자 권한을 해제할까요?",
    description:
      pending.kind === "withdraw"
        ? `${pending.user.nickname} (#${pending.user.id}) 님의 이름·이메일·연락처가 지워지고 앱 알림도 끊깁니다. 되돌릴 수 없습니다.`
        : pending.type === "ADMIN"
          ? `${pending.user.nickname} (#${pending.user.id}) 님이 관리자 페이지와 글 삭제 권한을 갖게 됩니다.`
          : `${pending.user.nickname} (#${pending.user.id}) 님이 일반 회원으로 바뀝니다.`,
  }

  const from = list && list.total > 0 ? (list.page - 1) * list.size + 1 : 0
  const to = list ? Math.min(list.total, list.page * list.size) : 0

  return (
    <div className="mx-auto max-w-[1040px] px-4 pt-6 md:px-6 md:pt-14">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-[#191F28] md:text-[28px]">관리자</h1>
        <span className="text-[13px] text-[#8B95A1]">한국 시간 기준</span>
      </div>
      <AdminNav />

      {/* 요약 */}
      <section aria-label="회원 요약" className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="회원" value={summary?.members} sub={<>7일 {strong(summary?.membersLast7d)} 가입</>} />
        <StatTile
          label="앱 설치 회원"
          value={summary?.appUsers}
          sub={
            <>
              iOS {strong(summary?.appUsersIos)}
              <span className="mx-1.5 text-[#D1D6DB]">·</span>
              Android {strong(summary?.appUsersAndroid)}
              <span className="mx-1.5 text-[#D1D6DB]">·</span>
              7일 {strong(summary?.appUsersLast7d)}
            </>
          }
        />
        <StatTile label="채용 알림 켠 회원" value={summary?.pushOn} sub={<>끈 회원 {strong(summary?.pushOff)}</>} />
        <StatTile
          label="등록 기기"
          value={summary?.devices}
          sub={
            <>
              관리자 {strong(summary?.admins)}
              <span className="mx-1.5 text-[#D1D6DB]">·</span>
              탈퇴 {strong(summary?.withdrawn)}
            </>
          }
        />
      </section>
      <p className="mt-2 text-[12px] text-[#8B95A1]">
        앱 설치 회원은 앱에서 로그인해 푸시 토큰을 등록한 회원입니다. 채용 알림은 앱에서 끄기 전까지 켜져 있습니다. 회원 수에는 관리자·탈퇴 회원이 들어가지 않습니다.
      </p>

      {/* 목록 */}
      <div className="mt-6">
        <Card>
          <div className="flex flex-col gap-3">
            <div role="group" aria-label="필터" className="flex flex-wrap gap-1.5">
              {FILTERS.map(f => (
                <button
                  key={f.value}
                  type="button"
                  aria-pressed={f.value === filter}
                  onClick={() => setParams({ filter: f.value, page: 1 })}
                  className={`h-8 rounded-full border px-3 text-[13px] ${
                    f.value === filter
                      ? "border-[#191F28] bg-[#191F28] font-bold text-white"
                      : "border-[#E5E8EB] bg-white text-[#4E5968] hover:bg-[#F7F8FA]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:max-w-[360px]">
                <input
                  type="search"
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  placeholder="닉네임·이름·이메일 검색"
                  aria-label="회원 검색"
                  className="h-9 w-full rounded-lg border border-[#E5E8EB] bg-white pl-3 pr-8 text-sm text-[#191F28] placeholder:text-[#B0B8C1] focus:border-[#191F28] focus:outline-none"
                />
                {keyword && (
                  <button
                    type="button"
                    aria-label="검색어 지우기"
                    onClick={() => setKeyword("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-1 text-[#8B95A1] hover:text-[#4E5968]"
                  >
                    ✕
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between gap-3 text-[13px] text-[#6B7684] md:justify-end">
                <span className="tabular-nums">
                  {list ? (
                    list.total > 0 ? (
                      <>
                        {from.toLocaleString()}–{to.toLocaleString()} / 총 {strong(list.total)}명
                      </>
                    ) : (
                      "0명"
                    )
                  ) : (
                    "불러오는 중…"
                  )}
                  {isFetching && list && <span className="ml-1.5 text-[#B0B8C1]">갱신 중</span>}
                </span>
                <label className="flex items-center gap-1.5">
                  <span className="sr-only">페이지 크기</span>
                  <select
                    value={size}
                    onChange={e => setParams({ size: Number(e.target.value), page: 1 })}
                    className="h-8 rounded-lg border border-[#E5E8EB] bg-white px-2 text-[13px] text-[#4E5968]"
                  >
                    {SIZES.map(s => (
                      <option key={s} value={s}>
                        {s}명씩
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          </div>

          {listError ? (
            <p className="py-10 text-center text-sm text-error">회원 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>
          ) : list ? (
            <UsersTable
              users={list.users}
              meId={me?.id}
              busyId={mutation.isPending ? mutation.variables?.user.id : null}
              onChangeType={(user, type) => setPending({ kind: "type", user, type })}
              onWithdraw={user => setPending({ kind: "withdraw", user })}
            />
          ) : (
            <div className="h-[320px] animate-pulse rounded-xl bg-[#F7F8FA]" />
          )}

          {list && <Pagination page={list.page} totalPages={list.totalPages} onChange={p => setParams({ page: p })} />}
        </Card>
      </div>

      <ConfirmDialog
        isOpen={!!pending && !mutation.isPending}
        handleDialog={() => setPending(null)}
        title={dialog?.title ?? ""}
        description={dialog?.description}
        action={() => pending && mutation.mutate(pending)}
      />
    </div>
  )
}

const Fallback = () => <div className="mx-auto max-w-[1040px] px-4 py-24 text-center text-coolgray">불러오는 중…</div>

/** useSearchParams 는 Suspense 안에서만 정적 빌드가 된다 */
const AdminUsersPage = () => (
  <Suspense fallback={<Fallback />}>
    <AdminUsersContent />
  </Suspense>
)

export default AdminUsersPage
