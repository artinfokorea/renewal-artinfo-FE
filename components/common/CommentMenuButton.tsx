import React from "react"

interface Props {
  label: string
  action: () => void
}

const CommentMenuButton = ({ label, action }: Props) => {
  return (
    <button className="py-2 text-left text-base" onClick={action}>
      {label}
    </button>
  )
}

export default CommentMenuButton
