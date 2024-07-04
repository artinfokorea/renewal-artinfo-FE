import { Button } from "@headlessui/react"
import React from "react"
import EditIcon from "../icons/EditIcon"
import TrashIcon from "../icons/TrashIcon"

interface Props {
  handleEdit: () => void
  handleDelete: () => void
  className?: string
}

const ItemManageBox = ({ handleEdit, handleDelete, className }: Props) => {
  return (
    <div className={`flex gap-2 md:gap-4 ${className}`}>
      <Button
        onClick={handleEdit}
        className="rounded-lg border-2 border-whitesmoke p-2"
      >
        <EditIcon className="h-5 w-5" />
      </Button>
      <Button
        onClick={handleDelete}
        className="rounded-lg border-2 border-whitesmoke p-2"
      >
        <TrashIcon className="h-5 w-5" />
      </Button>
    </div>
  )
}

export default ItemManageBox
