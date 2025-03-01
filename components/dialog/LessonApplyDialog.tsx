"use client"

import React, { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { Dialog, DialogPanel, DialogTitle, Textarea } from "@headlessui/react"
import CloseIcon from "../icons/CloseIcon"

interface LessonApplyDialogProps {
  open: boolean
  close: () => void
  handleApply: (introduce: string) => void
}

export const LessonApplyDialog = ({
  open,
  close,
  handleApply,
}: LessonApplyDialogProps) => {
  const [contents, setContents] = useState("")

  useEffect(() => {
    return () => {
      setContents("")
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
            레슨 신청
          </DialogTitle>

          <div className="border-b-2 border-whitesmoke" />
          <div className="p-4 md:p-6">
            <div className="relative">
              <Textarea
                value={contents}
                onChange={e => setContents(e.target.value)}
                maxLength={50}
                className="h-64 w-full resize-none rounded border px-4 py-2"
                placeholder="간단한 자기소개"
              />
              {contents.length > 0 && (
                <button
                  onClick={() => setContents("")}
                  className="absolute right-4 top-2 text-grey"
                >
                  <CloseIcon />
                </button>
              )}
              <p className="absolute bottom-3 right-4 text-sm font-bold text-black">
                {contents.length} / 50
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
                disabled={contents.length === 0}
                type="button"
                onClick={() => handleApply(contents)}
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
