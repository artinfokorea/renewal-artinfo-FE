import React from "react"

interface Props {
  items: { label: string; count: number }[]
  emptyText?: string
}

/** 가로 막대 목록 (한 가지 색). 라벨과 값은 글자로 함께 보여준다 */
const BarList = ({ items, emptyText = "데이터가 없습니다." }: Props) => {
  const max = Math.max(1, ...items.map(i => i.count))
  if (items.length === 0) {
    return <p className="py-6 text-center text-sm text-coolgray">{emptyText}</p>
  }
  return (
    <ul className="flex flex-col gap-3">
      {items.map(item => (
        <li key={item.label} className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-[#333D4B]">{item.label}</span>
            <span className="tabular-nums font-semibold text-[#191F28]">
              {item.count.toLocaleString()}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-[#F2F4F6]">
            <div
              className="h-2 rounded-full bg-main"
              style={{ width: `${(item.count / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

export default BarList
