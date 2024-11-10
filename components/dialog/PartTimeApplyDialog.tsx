import { Dialog, DialogPanel, DialogTitle, Textarea } from "@headlessui/react"
import React, { useEffect, useState } from "react"
import { Button } from "../ui/button"
import CloseIcon from "../icons/CloseIcon"

interface PartTimeApplyDialogProps {
  open: boolean
  close: () => void
  handleApply: (profile: string) => void
}

export const PartTimeApplyDialog = ({
  open,
  close,
  handleApply,
}: PartTimeApplyDialogProps) => {
  const [introduce, setIntroduce] = useState("")

  useEffect(() => {
    return () => {
      setIntroduce("")
    }
  }, [open])

  return (
    <Dialog
      open={open}
      onClose={close}
      className="relative z-50 flex items-center justify-center rounded-lg"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="z-10 mx-auto w-full rounded-xl bg-white py-4 md:max-w-[350px]">
          <DialogTitle className="my-2 text-center text-base font-semibold md:text-lg">
            연주신청
          </DialogTitle>

          <div className="border-b-2 border-whitesmoke" />
          <div className="p-4 md:p-6">
            <div className="relative">
              <Textarea
                value={introduce}
                onChange={e => setIntroduce(e.target.value)}
                maxLength={100}
                className="h-64 w-full resize-none rounded border px-4 py-2"
                placeholder="소개"
              />
              {introduce.length > 0 && (
                <button
                  onClick={() => setIntroduce("")}
                  className="absolute right-4 top-2 text-grey"
                >
                  <CloseIcon />
                </button>
              )}
              <p className="absolute bottom-3 right-4 text-sm font-bold text-black">
                {introduce.length} / 100
              </p>
            </div>

            <p className="break-keep text-sm font-medium text-silver">
              * 연주 신청시 본인의 프로필(학력, 전공, 연락처)이 상대방에게
              전달됩니다.
            </p>

            <div className="mt-4 flex justify-end gap-4">
              <Button
                type="button"
                onClick={close}
                className="border-gray h-8 rounded-lg border px-4 text-sm text-main"
              >
                취소
              </Button>
              <Button
                disabled={introduce.length === 0}
                type="button"
                onClick={() => handleApply(introduce)}
                className="h-8 rounded-lg bg-main px-4 text-sm text-white disabled:bg-whitesmoke disabled:text-dimgray"
              >
                신청
              </Button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
