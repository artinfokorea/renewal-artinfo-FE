"use client"

import React from "react"
import { ChevronRight, LucideIcon } from "lucide-react"

interface GroupProps {
  /** 카드 위에 작게 보이는 섹션 제목 */
  title?: string
  /** 카드 아래 설명 */
  footer?: string
  children: React.ReactNode
}

/** iOS 설정 앱 스타일의 묶음 카드 — 안에 SettingsRow 를 나열한다 (앱 SettingsGroup 과 같은 구성) */
export const SettingsGroup = ({ title, footer, children }: GroupProps) => {
  const rows = React.Children.toArray(children).filter(Boolean)
  return (
    <section className="flex flex-col gap-2">
      {title && (
        <h3 className="px-1 text-[13px] font-semibold text-[#6B7684]">
          {title}
        </h3>
      )}
      <div className="overflow-hidden rounded-2xl border border-[#E5E8EB] bg-white">
        {rows.map((row, index) => (
          <React.Fragment key={index}>
            {index > 0 && <div className="ml-4 h-px bg-[#E5E8EB]" />}
            {row}
          </React.Fragment>
        ))}
      </div>
      {footer && (
        <p className="px-1 text-xs leading-[17px] text-[#6B7684]">{footer}</p>
      )}
    </section>
  )
}

interface RowProps {
  icon?: LucideIcon
  iconClassName?: string
  label: string
  /** 오른쪽에 회색으로 보이는 값. 없으면 placeholder 를 파란 글씨로 보여준다 */
  value?: string | null
  placeholder?: string
  onClick?: () => void
  /** 라벨을 빨간색으로 (탈퇴) */
  destructive?: boolean
  disabled?: boolean
}

export const SettingsRow = ({
  icon: Icon,
  iconClassName = "text-[#4E5968]",
  label,
  value,
  placeholder,
  onClick,
  destructive,
  disabled,
}: RowProps) => {
  const clickable = !!onClick && !disabled
  const Tag: "button" | "div" = clickable ? "button" : "div"
  return (
    <Tag
      type={clickable ? "button" : undefined}
      onClick={onClick}
      disabled={disabled}
      className={`flex min-h-[52px] w-full items-center gap-3 bg-white px-4 py-3 text-left ${
        clickable ? "transition-colors hover:bg-[#F7F8FA] active:bg-[#F2F4F6]" : ""
      } ${disabled ? "opacity-60" : ""}`}
    >
      {Icon && (
        <span className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-lg bg-[#F2F4F6]">
          <Icon className={`h-4 w-4 ${iconClassName}`} strokeWidth={1.8} />
        </span>
      )}
      <span
        className={`flex-none text-base font-medium ${
          destructive ? "text-error" : "text-[#191F28]"
        }`}
      >
        {label}
      </span>
      <span
        className={`min-w-0 flex-1 truncate text-right text-[15px] ${
          value ? "text-[#6B7684]" : "font-medium text-main"
        }`}
      >
        {value || placeholder || ""}
      </span>
      {clickable && (
        <ChevronRight className="h-4 w-4 flex-none text-[#9ca3af]" strokeWidth={2.2} />
      )}
    </Tag>
  )
}
