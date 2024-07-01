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
        className="border-2 p-2 border-whitesmoke rounded-lg"
      >
        <EditIcon className="w-5 h-5 md:w-6 md:h-6" />
      </Button>
      <Button
        onClick={handleDelete}
        className="border-2 p-2 border-whitesmoke rounded-lg"
      >
        <TrashIcon className="w-5 h-5 md:w-6 md:h-6" />
      </Button>
    </div>
  )
}

export default ItemManageBox
