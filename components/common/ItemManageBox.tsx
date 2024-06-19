import { Button } from "@headlessui/react";
import React from "react";
import EditIcon from "../icons/EditIcon";
import TrashIcon from "../icons/TrashIcon";

interface Props {
  handleEdit: () => void;
  handleDelete: () => void;
}

const ItemManageBox = ({ handleEdit, handleDelete }: Props) => {
  return (
    <div className="mt-8 px-4 mb-4 flex relative">
      <div className="w-3/5 mx-auto flex items-center">
        <div className="border border-whitesmoke w-full" />
      </div>
      <div className="absolute -bottom-5 right-4 flex gap-4">
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
    </div>
  );
};

export default ItemManageBox;
