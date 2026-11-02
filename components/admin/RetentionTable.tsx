import React from "react"

interface Props {
  cohorts: { cohort: string; size: number; weeks: (number | null)[] }[]
}

const weekLabel = (monday: string) =>
  `${Number(monday.slice(5, 7))}.${Number(monday.slice(8, 10))} 주`

/**
 * 주간 리텐션 표 — 행: 첫 방문 주, 열: 1~4주차 재방문 비율.
 * 진할수록 높은 값(파란색 한 가지). 숫자를 함께 적어 색만으로 읽지 않게 한다.
 */
const RetentionTable = ({ cohorts }: Props) => {
  const shown = cohorts.filter(c => c.size > 0)
  if (shown.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-coolgray">
        아직 데이터가 없습니다. 기록을 시작한 뒤 2주가 지나면 1주차부터 보입니다.
      </p>
    )
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] text-sm">
        <caption className="sr-only">첫 방문 주별 1~4주차 재방문 비율</caption>
        <thead>
          <tr className="text-[12px] text-[#6B7684]">
            <th className="px-2 py-2 text-left font-medium">첫 방문 주</th>
            <th className="px-2 py-2 text-right font-medium">방문자</th>
            {[1, 2, 3, 4].map(w => (
              <th key={w} className="px-2 py-2 text-center font-medium">
                {w}주차
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {shown.map(c => (
            <tr key={c.cohort} className="border-t border-[#F2F4F6]">
              <td className="px-2 py-2 text-[#4E5968]">{weekLabel(c.cohort)}</td>
              <td className="px-2 py-2 text-right tabular-nums text-[#191F28]">
                {c.size.toLocaleString()}
              </td>
              {c.weeks.map((value, i) => (
                <td key={i} className="p-1">
                  {value === null ? (
                    <div className="py-1.5 text-center text-[#B0B8C1]">–</div>
                  ) : (
                    <div
                      className={`rounded-md py-1.5 text-center tabular-nums ${
                        value >= 50 ? "text-white" : "text-[#191F28]"
                      }`}
                      style={{
                        backgroundColor: `rgba(0, 100, 255, ${0.08 + (Math.min(value, 100) / 100) * 0.82})`,
                      }}
                    >
                      {value}%
                    </div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RetentionTable
