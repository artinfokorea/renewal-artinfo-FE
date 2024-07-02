import React from "react"
import { Button } from "../ui/button"
import PlusIcon from "../icons/PlusIcon"

interface Props {
  className?: string
  onClick?: () => void
}

const AddButton = ({ className, onClick }: Props) => {
  return (
    <Button onClick={onClick} className={className}>
      <PlusIcon className="w-6 h-6" />
    </Button>
  )
}

export default AddButton
