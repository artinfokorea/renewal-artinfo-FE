"use client"

import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
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
    <Dialog open={isOpen} onOpenChange={handleDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary font-bold">{title}</DialogTitle>
          <DialogDescription
            className={`font-semibolde text-base ${error ? "text-error" : ""}`}
          >
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" className="bg-main text-white">
              확인
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AlertDialog
