"use client"

import React from "react"
import {
  Calendar,
  GraduationCap,
  LogOut,
  Mail,
  Pencil,
  Phone,
  Lock,
  UserMinus,
} from "lucide-react"
import FallbackImage from "../common/FallbackImage"
import { SettingsGroup, SettingsRow } from "./SettingsGroup"
import filters from "@/lib/filters"
import { USER } from "@/types/users"
import { SchoolType } from "@/types/lessons"

interface Props {
  user?: USER
  isWithdrawing?: boolean
  onEdit: () => void
  onPhone: () => void
  onPassword: () => void
  onSignOut: () => void
  onWithdraw: () => void
}

const SCHOOL_LABELS: { type: SchoolType; label: string }[] = [
  { type: SchoolType.UNDERGRADUATE, label: "학사" },
  { type: SchoolType.MASTER, label: "석사" },
  { type: SchoolType.DOCTOR, label: "박사" },
]

/** 내 정보 조회 화면 — 프로필 카드 + 설정 그룹 (앱 my-profile 과 같은 구성) */
const ProfileOverview = ({
  user,
  isWithdrawing,
  onEdit,
  onPhone,
  onPassword,
  onSignOut,
  onWithdraw,
}: Props) => {
  const filter = filters()
  const majors = user?.majors ?? []
  const schools = SCHOOL_LABELS.map(({ type, label }) => ({
    type,
    label,
    name: user?.schools?.find(school => school.type === type)?.name,
  })).filter(school => !!school.name)

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      {/* 프로필 카드 */}
      <div className="flex flex-col gap-4 rounded-[20px] border border-[#E5E8EB] bg-white p-5">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 flex-none overflow-hidden rounded-full bg-[#F2F4F6]">
            <FallbackImage
              src={user?.iconImageUrl || ""}
              alt="user_profile_image"
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-xl font-bold tracking-[-0.3px] text-[#191F28]">
              {user?.name || "이름 없음"}
            </h2>
            {user?.nickname && (
              <p className="truncate text-sm text-[#6B7684]">@{user.nickname}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onEdit}
            className="flex h-8 flex-none items-center gap-1 rounded-full bg-[#F2F4F6] px-3 text-[13px] font-semibold text-[#333D4B] transition-colors hover:bg-[#E5E8EB]"
          >
            <Pencil className="h-3 w-3" strokeWidth={2.4} />
            수정
          </button>
        </div>
        {majors.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5">
            {majors.map(major => (
              <li
                key={major.id}
                className="rounded-full bg-[#E8F3FF] px-2.5 py-1 text-xs font-semibold text-[#1B64DA]"
              >
                {major.koName}
              </li>
            ))}
          </ul>
        ) : (
          <button
            type="button"
            onClick={onEdit}
            className="text-left text-[13px] font-medium text-main"
          >
            전공을 등록하면 맞춤 채용·레슨 정보를 받을 수 있어요
          </button>
        )}
      </div>

      <SettingsGroup title="기본 정보">
        <SettingsRow icon={Mail} label="이메일" value={user?.email} />
        <SettingsRow
          icon={Phone}
          label="휴대폰"
          value={user?.phone}
          placeholder="등록하기"
          onClick={onPhone}
        />
        <SettingsRow
          icon={Calendar}
          label="생년월일"
          value={filter.YYYYMMDD(user?.birth, "YYYY-MM-DD")}
          placeholder="등록하기"
          onClick={onEdit}
        />
      </SettingsGroup>

      <SettingsGroup title="학력">
        {schools.length > 0 ? (
          schools.map(school => (
            <SettingsRow
              key={school.type}
              icon={GraduationCap}
              label={school.label}
              value={school.name}
            />
          ))
        ) : (
          <SettingsRow
            icon={GraduationCap}
            label="학력"
            placeholder="등록하기"
            onClick={onEdit}
          />
        )}
      </SettingsGroup>

      <SettingsGroup
        title="계정"
        footer="채용 공고 푸시 알림은 아트인포 앱의 내 정보에서 설정할 수 있습니다."
      >
        <SettingsRow icon={Lock} label="비밀번호 변경" onClick={onPassword} />
        <SettingsRow icon={LogOut} label="로그아웃" onClick={onSignOut} />
        <SettingsRow
          icon={UserMinus}
          iconClassName="text-error"
          label={isWithdrawing ? "탈퇴 처리 중…" : "회원탈퇴"}
          destructive
          disabled={isWithdrawing}
          onClick={onWithdraw}
        />
      </SettingsGroup>
    </div>
  )
}

export default ProfileOverview
