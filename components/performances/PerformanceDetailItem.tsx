import React from "react"

interface Props {
  title: string
  content: string
}

const PerformanceDetailItem = ({ title, content }: Props) => {
  return (
    <div className="flex" key={title}>
      <span className="basis-1/4 font-semibold text-grey md:basis-1/6">
        {title}
      </span>
      <span className="basis-3/4 font-medium">{content}</span>
    </div>
  )
}

export default PerformanceDetailItem
