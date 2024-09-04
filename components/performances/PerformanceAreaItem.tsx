import React from "react"

interface Props {
  title: string
  content: string
}

const PerformanceAreaItem = ({ title, content }: Props) => {
  return (
    <div className="flex" key={title}>
      <span className="basis-1/6 font-semibold text-grey">{title}</span>
      <span className="basis-5/6">{content}</span>
    </div>
  )
}

export default PerformanceAreaItem
