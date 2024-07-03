"use client"

import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface Props {
  isOpen: boolean
  handleDialog: () => void
  title: string
  description?: string
  action: () => void
}

const ConfirmDialog = ({
  isOpen,
  handleDialog,
  title,
  description,
  action,
}: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={handleDialog}>
      <DialogContent className="w-[300px] rounded-md">
        <DialogHeader>
          <DialogTitle className="text-primary font-bold">{title}</DialogTitle>
          <DialogDescription className="font-semibolde text-base">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-row justify-center gap-2 mt-2">
          <DialogClose asChild>
            <Button type="button" className="bg-main text-white">
              취소
            </Button>
          </DialogClose>
          <Button
            onClick={action}
            type="button"
            className="bg-error text-white"
          >
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmDialog
