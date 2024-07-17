import { queries } from "@/lib/queries"
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react"
import { useQuery } from "@tanstack/react-query"
import React from "react"
import CloseIcon from "../icons/CloseIcon"
import { Button } from "../ui/button"
import { MAJOR } from "@/types/majors"

interface Props {
  open: boolean
  close: () => void
  selectedMajors: MAJOR[]
  handleSelectMajor: (major: MAJOR) => void
  multiple?: boolean
}

const MajorDialog = ({
  open,
  close,
  selectedMajors,
  handleSelectMajor,
  multiple,
}: Props) => {
  const { data } = useQuery(queries.majors.list())

  const selectMajor = (major: MAJOR) => {
    handleSelectMajor(major)
    if (!multiple) close()
  }

  const majorCategories = Array.from(
    new Set(data?.majors.map(major => major.secondGroupEn)),
  ).map(key => {
    const major = data?.majors.find(m => m.secondGroupEn === key)
    return {
      key,
      value: major?.secondGroupKo,
    }
  })

  const selectedMajorIds = selectedMajors.map(major => major.id)

  return (
    <Dialog
      open={open}
      onClose={close}
      className="relative z-50 flex items-center justify-center rounded-lg"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="z-10 mx-auto h-[620px] max-w-[650px] overflow-auto rounded-xl bg-white py-4">
          <div className="relative mb-4">
            <DialogTitle className="flex-1 text-center font-semibold md:text-lg">
              전공선택
            </DialogTitle>
            <Button onClick={close} className="absolute -top-[8px] right-2">
              <CloseIcon className="h-6 w-6 text-silver" />
            </Button>
          </div>
          <div className="border-b-2 border-whitesmoke" />
          <div className="p-4 md:px-8">
            {majorCategories?.map(({ key, value }) => (
              <div key={key} className="my-3 flex flex-col gap-3">
                <span className="font-bold text-coolgray">{value}</span>
                <div className="flex flex-wrap gap-2">
                  {data?.majors.map(major => {
                    return (
                      major.secondGroupEn === key && (
                        <Button
                          type="button"
                          key={major.id}
                          onClick={() => selectMajor(major)}
                          className={`h-6 rounded-xl px-3 text-sm text-white md:h-7 md:text-base ${
                            selectedMajorIds.includes(major.id)
                              ? "bg-main"
                              : "bg-lavender"
                          }`}
                        >
                          {major.koName}
                        </Button>
                      )
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
          {multiple && (
            <div className="flex justify-center">
              <Button
                type="button"
                className={`h-8 rounded-lg bg-main text-sm text-white`}
                onClick={close}
              >
                선택 완료
              </Button>
            </div>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  )
}

export default MajorDialog
