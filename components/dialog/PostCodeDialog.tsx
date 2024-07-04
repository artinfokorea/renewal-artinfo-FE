import { Dialog, DialogPanel } from "@headlessui/react"
import React from "react"
import DaumPostcode from "react-daum-postcode"

interface Props {
  isOpen: boolean
  close: () => void
  setValue: (address: string) => void
}

const PostCodeDialog = ({ isOpen, close, setValue }: Props) => {
  const style = {
    width: "350px",
    height: "500px",
    border: "1.4px solid #333333",
  }

  const completeHandler = (data: any) => {
    setValue(data.address)
    close()
  }

  return (
    <Dialog
      open={isOpen}
      onClose={close}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <DialogPanel>
        <DaumPostcode style={style} onComplete={completeHandler} />
      </DialogPanel>
    </Dialog>
  )
}

export default PostCodeDialog
