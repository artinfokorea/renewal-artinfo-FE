import React from "react"
import { Button } from "../ui/button"

interface Props {
  onClick: () => void
}

const CreateLinkButton = ({ onClick }: Props) => {
  return (
    <Button
      className="h-8 rounded-full bg-main px-5 text-xs font-semibold text-white"
      onClick={onClick}
    >
      등록
    </Button>
  )
}

export default CreateLinkButton
