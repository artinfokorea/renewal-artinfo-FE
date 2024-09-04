import { IconProps } from "@/interface"
import React from "react"

const ArrowUpIcon = ({ className = "size-6" }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      strokeWidth={3}
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M11.47 2.47a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-1.5 0V4.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export default ArrowUpIcon
