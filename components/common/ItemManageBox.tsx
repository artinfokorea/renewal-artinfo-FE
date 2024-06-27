import { Button } from "@headlessui/react"
import React from "react"
import EditIcon from "../icons/EditIcon"
import TrashIcon from "../icons/TrashIcon"

interface Props {
  show: boolean
  handleEdit: () => void
  handleDelete: () => void
}

const ItemManageBox = ({ show, handleEdit, handleDelete }: Props) => {
  return (
    <div className="my-8 px-4 flex relative">
      <div
        className={`mx-auto border-b-2 border-whitesmoke ${
          show ? "w-2/5 md:w-3/5" : "w-full"
        }`}
      />
      {show && (
        <div className="absolute -bottom-5 right-4 flex gap-2 md:gap-4">
          <Button
            onClick={handleEdit}
            className="border p-2 border-whitesmoke rounded-lg"
          >
            <EditIcon className="w-6 h-6" />
          </Button>
          <Button
            onClick={handleDelete}
            className="border p-2 border-whitesmoke rounded-lg"
          >
            <TrashIcon className="w-6 h-6" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default ItemManageBox
