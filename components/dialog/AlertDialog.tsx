"use client"

import React from "react"
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react"
import { Button } from "@/components/ui/button"

interface Props {
  isOpen: boolean
  handleDialog: () => void
  title: string
  description?: string
  error?: boolean
}

const AlertDialog = ({
  isOpen,
  handleDialog,
  title,
  description,
  error,
}: Props) => {
  return (
    <Dialog
      open={isOpen}
      onClose={handleDialog}
      className="relative z-50 flex items-center justify-center rounded-lg"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-[350px] bg-white rounded-xl flex flex-col p-4">
          <DialogTitle className="text-primary font-bold md:text-lg">
            {title}
          </DialogTitle>
          <p
            className={`font-medium py-3 text-sm ${error ? "text-error" : ""}`}
          >
            {description}
          </p>

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={handleDialog}
              className="bg-main text-white"
            >
              확인
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}

export default AlertDialog
