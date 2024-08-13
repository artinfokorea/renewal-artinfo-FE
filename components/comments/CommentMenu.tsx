import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react"
import EllipsisVerticalIcon from "../icons/EllipsisVerticalIcon"
import EditIcon from "../icons/EditIcon"
import TrashIcon from "../icons/TrashIcon"
import { Fragment } from "react"
import FlagIcon from "../icons/FlagIcon"
import useToast from "@/hooks/useToast"

interface Props {
  isAuthor: boolean
  handleDelete: () => void
  handleEdit: () => void
}

const CommentMenu = ({ isAuthor, handleDelete, handleEdit }: Props) => {
  const { successToast } = useToast()

  return (
    <Menu as={Fragment}>
      <MenuButton>
        <EllipsisVerticalIcon />
      </MenuButton>
      <Transition
        enter="transition-opacity duration-500"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        {isAuthor ? (
          <MenuItems className="absolute right-0 top-10 z-50 w-24 rounded-lg bg-white shadow-xl md:left-0">
            <MenuItem>
              <button
                onClick={handleEdit}
                className="flex h-10 w-24 cursor-pointer items-center justify-between rounded-t-lg px-4 hover:bg-whitesmoke"
              >
                <EditIcon className="h-5 w-5" />{" "}
                <span className="text-sm">수정</span>
              </button>
            </MenuItem>

            <MenuItem>
              <button
                onClick={handleDelete}
                className="flex h-10 w-24 cursor-pointer items-center justify-between rounded-b-lg px-4 hover:bg-whitesmoke"
              >
                <TrashIcon className="h-5 w-5" />{" "}
                <span className="text-sm">삭제</span>
              </button>
            </MenuItem>
          </MenuItems>
        ) : (
          <MenuItems className="absolute right-0 top-10 z-50 w-24 rounded-lg bg-white shadow-xl md:left-0">
            <MenuItem>
              <button className="flex h-10 w-24 cursor-pointer items-center justify-between rounded-lg rounded-b-lg px-4 hover:bg-whitesmoke">
                <FlagIcon className="h-5 w-5" />{" "}
                <span
                  onClick={() => successToast("신고가 접수되었습니다.")}
                  className="text-sm"
                >
                  신고
                </span>
              </button>
            </MenuItem>
          </MenuItems>
        )}
      </Transition>
    </Menu>
  )
}
export default CommentMenu
