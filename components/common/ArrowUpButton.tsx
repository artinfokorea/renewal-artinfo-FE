import React from "react"
import { Button } from "../ui/button"
import ArrowUpIcon from "../icons/ArrowUpIcon"

interface Props {
  className?: string
  onClick?: () => void
}

const ArrowUpButton = ({ className, onClick }: Props) => {
  return (
    <Button onClick={onClick} className={className}>
      <ArrowUpIcon />
    </Button>
  )
}

export default ArrowUpButton
