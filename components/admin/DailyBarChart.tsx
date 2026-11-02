"use client"

import React, { useState } from "react"
import { AdminDailyMetric, AdminDailyPoint } from "@/types/admin"

export const METRIC_LABEL: Record<AdminDailyMetric, string> = {
  activeUsers: "로그인한 사용자",
  signups: "가입",
  jobs: "새 채용 공고",
  posts: "새 나눔 글",
  comments: "새 댓글",
}

interface Props {
  points: AdminDailyPoint[]
  metric: AdminDailyMetric
}

const HEIGHT = 200
const PAD_TOP = 12
const PAD_BOTTOM = 24
const PAD_LEFT = 36

/** 보기 좋은 눈금 최대값 (1, 2, 5 × 10ⁿ) */
const niceMax = (max: number) => {
  if (max <= 4) return 4
  const pow = Math.pow(10, Math.floor(Math.log10(max)))
  const step = [1, 2, 5, 10].find(s => s * pow * 4 >= max) ?? 10
  return step * pow * 4
}

/** 위쪽 모서리만 둥근 막대 (아래는 기준선에 붙는다) */
const barPath = (x: number, top: number, w: number, base: number) => {
  const r = Math.min(4, w / 2, (base - top) / 2)
  return `M${x},${base} V${top + r} Q${x},${top} ${x + r},${top} H${x + w - r} Q${x + w},${top} ${x + w},${top + r} V${base} Z`
}

const shortDate = (date: string) => `${Number(date.slice(5, 7))}.${Number(date.slice(8, 10))}`

/**
 * 일별 막대 차트 (지표 하나). 막대에 마우스를 올리면 날짜와 값을 보여주고,
 * 같은 데이터를 표로도 볼 수 있다.
 */
const DailyBarChart = ({ points, metric }: Props) => {
  const [hover, setHover] = useState<number | null>(null)
  const [showTable, setShowTable] = useState(false)
  const width = 720
  const values = points.map(p => p[metric])
  const max = niceMax(Math.max(0, ...values))
  const plotW = width - PAD_LEFT
  const plotH = HEIGHT - PAD_TOP - PAD_BOTTOM
  const slot = plotW / Math.max(points.length, 1)
  const barW = Math.max(2, Math.min(18, slot - 2))
  const y = (v: number) => PAD_TOP + plotH - (v / max) * plotH
  const ticks = [0, max / 4, max / 2, (max * 3) / 4, max]
  const labelEvery = Math.ceil(points.length / 8)
  const total = values.reduce((a, b) => a + b, 0)
  const hovered = hover !== null ? points[hover] : null

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <span className="text-sm text-[#6B7684]">
          기간 합계{" "}
          <strong className="text-base font-bold tabular-nums text-[#191F28]">
            {total.toLocaleString()}
          </strong>
        </span>
        <button
          type="button"
          onClick={() => setShowTable(!showTable)}
          className="text-[13px] text-[#6B7684] underline-offset-2 hover:underline"
          aria-expanded={showTable}
        >
          {showTable ? "차트로 보기" : "표로 보기"}
        </button>
      </div>

      {showTable ? (
        <div className="max-h-[260px] overflow-auto rounded-xl border border-[#EEF0F3]">
          <table className="w-full text-sm">
            <caption className="sr-only">{METRIC_LABEL[metric]} 일별 표</caption>
            <thead className="sticky top-0 bg-[#F7F8FA] text-[#6B7684]">
              <tr>
                <th className="px-3 py-2 text-left font-medium">날짜</th>
                <th className="px-3 py-2 text-right font-medium">{METRIC_LABEL[metric]}</th>
              </tr>
            </thead>
            <tbody>
              {[...points].reverse().map(p => (
                <tr key={p.date} className="border-t border-[#F2F4F6]">
                  <td className="px-3 py-1.5 text-[#4E5968]">{p.date}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums text-[#191F28]">
                    {p[metric].toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="relative">
          <svg
            viewBox={`0 0 ${width} ${HEIGHT}`}
            className="h-auto w-full"
            role="img"
            aria-label={`${METRIC_LABEL[metric]} 일별 막대 차트, 기간 합계 ${total}`}
            onMouseLeave={() => setHover(null)}
          >
            {ticks.map(t => (
              <g key={t}>
                <line
                  x1={PAD_LEFT}
                  x2={width}
                  y1={y(t)}
                  y2={y(t)}
                  stroke="#EEF0F3"
                  strokeWidth={1}
                />
                <text
                  x={PAD_LEFT - 8}
                  y={y(t) + 4}
                  textAnchor="end"
                  fontSize={11}
                  fill="#8B95A1"
                >
                  {Math.round(t).toLocaleString()}
                </text>
              </g>
            ))}
            {points.map((p, i) => {
              const v = p[metric]
              const cx = PAD_LEFT + slot * i + slot / 2
              const top = y(v)
              const h = PAD_TOP + plotH - top
              return (
                <g key={p.date} onMouseEnter={() => setHover(i)}>
                  {/* 막대보다 넓은 투명 영역으로 마우스를 잡는다 */}
                  <rect x={cx - slot / 2} y={PAD_TOP} width={slot} height={plotH} fill="transparent" />
                  {v > 0 && (
                    <path
                      d={barPath(cx - barW / 2, top, barW, PAD_TOP + plotH)}
                      fill={hover === null || hover === i ? "#0064FF" : "#9EC2FF"}
                    />
                  )}
                  {i % labelEvery === 0 && (
                    <text
                      x={cx}
                      y={HEIGHT - 6}
                      textAnchor="middle"
                      fontSize={11}
                      fill="#8B95A1"
                    >
                      {shortDate(p.date)}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>
          {hovered && hover !== null && (
            <div
              className="pointer-events-none absolute top-0 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#191F28] px-2.5 py-1.5 text-xs text-white shadow"
              style={{
                left: `${((PAD_LEFT + slot * hover + slot / 2) / width) * 100}%`,
              }}
            >
              {hovered.date} · {METRIC_LABEL[metric]}{" "}
              <strong className="tabular-nums">{hovered[metric].toLocaleString()}</strong>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DailyBarChart
