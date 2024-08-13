import React from "react"
import DownIcon from "../icons/DownIcon"

interface Props {
  more: () => void
  label: string
  size: "sm" | "md"
}

const MoreButton = ({ more, label, size }: Props) => {
  return (
    <button
      className={`mx-auto flex items-center gap-2 text-main ${size === "md" ? "text-sm md:text-base" : "text-xs md:text-sm"}`}
      onClick={more}
    >
      <DownIcon className={`${size === "md" ? "h-6 w-6" : "h-5 w-5"}`} />
      <span>{label}</span>
    </button>
  )
}

export default MoreButton
