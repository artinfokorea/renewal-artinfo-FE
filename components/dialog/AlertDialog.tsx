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
      <DialogPanel className="fixed inset-0 bg-white z-10 w-[300px] h-[200px] rounded-xl flex">
        <DialogTitle className="text-primary font-bold">{title}</DialogTitle>
        <p className={`font-semibolde text-base ${error ? "text-error" : ""}`}>
          {description}
        </p>

        <div className="flex justify-end">
          <Button type="button" className="bg-main text-white">
            확인
          </Button>
        </div>
      </DialogPanel>
    </Dialog>
  )
}

export default AlertDialog
