"use client"

import React from "react"
import { AdminUser } from "@/types/admin"
import { kstDate, kstDateTime } from "./format"

const LOGIN_TYPE_LABEL: Record<string, string> = {
  EMAIL: "이메일",
  KAKAO: "카카오",
  NAVER: "네이버",
  GOOGLE: "구글",
  APPLE: "애플",
}

const PLATFORM_LABEL: Record<string, string> = { ios: "iOS", android: "Android" }

const Chip = ({ children, tone = "gray" }: { children: React.ReactNode; tone?: "gray" | "blue" | "green" | "red" | "dark" }) => {
  const cls = {
    gray: "bg-[#F2F4F6] text-[#6B7684]",
    blue: "bg-[#E8F3FF] text-[#1B64DA]",
    green: "bg-[#E9F7EC] text-[#2E8B57]",
    red: "bg-[#FDEBEB] text-[#D22B2B]",
    dark: "bg-[#191F28] text-white",
  }[tone]
  return <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-medium ${cls}`}>{children}</span>
}

const ActionButton = ({
  children,
  onClick,
  disabled,
  danger,
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  danger?: boolean
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`h-7 whitespace-nowrap rounded-md border px-2 text-[12px] font-medium disabled:cursor-not-allowed disabled:opacity-40 ${
      danger
        ? "border-[#F5C2C2] text-[#D22B2B] hover:bg-[#FDEBEB]"
        : "border-[#E5E8EB] text-[#4E5968] hover:bg-[#F7F8FA]"
    }`}
  >
    {children}
  </button>
)

interface Props {
  users: AdminUser[]
  /** 로그인한 관리자 본인 — 자기 행은 작업 버튼을 막는다 */
  meId?: number
  busyId?: number | null
  onChangeType: (user: AdminUser, type: "ADMIN" | "CLIENT") => void
  onWithdraw: (user: AdminUser) => void
}

const Th = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <th scope="col" className={`whitespace-nowrap px-3 py-2 text-left text-[12px] font-medium text-[#8B95A1] ${className}`}>
    {children}
  </th>
)

/** 회원 목록 표 — 넓으면 가로 스크롤 */
const UsersTable = ({ users, meId, busyId, onChangeType, onWithdraw }: Props) => {
  if (users.length === 0) {
    return <p className="py-10 text-center text-sm text-coolgray">조건에 맞는 회원이 없습니다.</p>
  }
  return (
    <div className="-mx-5 overflow-x-auto px-5">
      <table className="w-full min-w-[960px] border-collapse text-[13px]">
        <thead>
          <tr className="border-b border-[#EEF0F3]">
            <Th>회원</Th>
            <Th>연락처</Th>
            <Th>가입</Th>
            <Th>마지막 로그인</Th>
            <Th>로그인 방식</Th>
            <Th>앱</Th>
            <Th>채용 알림</Th>
            <Th>역할</Th>
            <Th className="text-right">관리</Th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => {
            const isMe = u.id === meId
            const withdrawn = !!u.deletedAt
            const busy = busyId === u.id
            return (
              <tr key={u.id} className={`border-b border-[#F2F4F6] align-top ${withdrawn ? "text-[#B0B8C1]" : ""}`}>
                <td className="px-3 py-2.5">
                  <div className="flex flex-col gap-0.5">
                    <span className="flex items-center gap-1.5">
                      <span className={`font-semibold ${withdrawn ? "" : "text-[#191F28]"}`}>{u.nickname}</span>
                      {u.name && u.name !== u.nickname && <span className="text-[12px] text-[#8B95A1]">{u.name}</span>}
                      {isMe && <Chip tone="blue">나</Chip>}
                      {withdrawn && <Chip tone="red">탈퇴</Chip>}
                    </span>
                    <span className="text-[12px] text-[#8B95A1]">
                      {u.email}
                      <span className="font-mono ml-1.5 text-[11px] text-[#B0B8C1]">#{u.id}</span>
                    </span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 tabular-nums text-[#4E5968]">{u.phone ?? "–"}</td>
                <td className="whitespace-nowrap px-3 py-2.5 tabular-nums text-[#4E5968]">
                  {kstDate(u.createdAt)}
                  {withdrawn && <div className="text-[11px] text-[#B0B8C1]">탈퇴 {kstDate(u.deletedAt)}</div>}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 tabular-nums text-[#4E5968]">{kstDateTime(u.lastLoginAt) ?? "–"}</td>
                <td className="px-3 py-2.5">
                  <div className="flex flex-wrap gap-1">
                    {u.loginTypes.length === 0 && <span className="text-[#B0B8C1]">–</span>}
                    {u.loginTypes.map(t => (
                      <Chip key={t}>{LOGIN_TYPE_LABEL[t] ?? t}</Chip>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  {u.hasApp ? (
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap gap-1">
                        {u.platforms.map(p => (
                          <Chip key={p} tone="dark">
                            {PLATFORM_LABEL[p] ?? p}
                          </Chip>
                        ))}
                        {u.deviceCount > 1 && <Chip>기기 {u.deviceCount}</Chip>}
                      </div>
                      <span className="text-[11px] text-[#8B95A1]">설치 {kstDate(u.appInstalledAt)}</span>
                    </div>
                  ) : (
                    <span className="text-[#B0B8C1]">웹만</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5">
                  {u.hasApp ? (
                    u.pushJob ? (
                      <Chip tone="green">켬</Chip>
                    ) : (
                      <Chip tone="red">끔</Chip>
                    )
                  ) : (
                    <span className="text-[#B0B8C1]">–</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5">
                  {u.type === "ADMIN" ? <Chip tone="blue">관리자</Chip> : <span className="text-[#4E5968]">회원</span>}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 text-right">
                  {!withdrawn && (
                    <div className="flex justify-end gap-1.5">
                      {u.type === "ADMIN" ? (
                        <ActionButton onClick={() => onChangeType(u, "CLIENT")} disabled={isMe || busy}>
                          관리자 해제
                        </ActionButton>
                      ) : (
                        <ActionButton onClick={() => onChangeType(u, "ADMIN")} disabled={isMe || busy}>
                          관리자 지정
                        </ActionButton>
                      )}
                      <ActionButton onClick={() => onWithdraw(u)} disabled={isMe || busy || u.type === "ADMIN"} danger>
                        탈퇴 처리
                      </ActionButton>
                    </div>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default UsersTable
