import React from "react"
import { Button } from "../ui/button"

interface Props {
  onClick: () => void
  text?: string
}

const CreateLinkButton = ({ onClick, text }: Props) => {
  return (
    <Button
      className="h-8 rounded-full bg-main px-5 text-xs font-semibold text-white"
      onClick={onClick}
    >
      {text || "등록"}
    </Button>
  )
}

export default CreateLinkButton
