import { queries } from "@/lib/queries"
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react"
import { useQuery } from "@tanstack/react-query"
import React, { ChangeEvent, useEffect, useState } from "react"
import CloseIcon from "../icons/CloseIcon"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Input } from "../ui/input"

interface Props {
  open: boolean
  close: () => void
  sendCode: (phone: string) => void
  checkCode: (phone: string, code: string) => void
  isLoading: boolean
}

const PhoneDialog = ({
  open,
  close,
  sendCode,
  checkCode,
  isLoading,
}: Props) => {
  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [time, setTime] = useState(180)
  const [isCounting, setIsCounting] = useState(false)

  const isValidPhone = /^01([0|1|6|7|8|9])-?([0-9]{4})-?([0-9]{4})$/.test(phone)

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined

    if (isCounting && time > 0) {
      intervalId = setInterval(() => {
        setTime(prevTime => prevTime - 1)
      }, 1000)
    } else if (time === 0) {
      clearInterval(intervalId)
      setIsCounting(false)
    }

    return () => clearInterval(intervalId)
  }, [isCounting, time])

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const unmaskedValue = e.target.value.replace(/\D/g, "")
    const maskedValue = unmaskedValue.replace(
      /(\d{3})(\d{3,4})(\d{4})/g,
      "$1-$2-$3",
    )

    setPhone(maskedValue)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes.toString().padStart(2, "0")} : ${seconds
      .toString()
      .padStart(2, "0")}`
  }

  const closeDialog = () => {
    setPhone("")
    setCode("")
    setTime(180)
    setIsCounting(false)
    close()
  }

  return (
    <Dialog
      open={open}
      onClose={closeDialog}
      className="relative z-50 flex items-center justify-center rounded-lg"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <form className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="z-10 mx-auto h-[370px] w-full overflow-auto rounded-xl bg-white py-4 md:max-w-[450px]">
          <div className="relative mb-4">
            <DialogTitle className="flex-1 text-center font-semibold md:text-lg">
              휴대폰 번호등록
            </DialogTitle>
            <Button onClick={close} className="absolute -top-[8px] right-2">
              <CloseIcon className="h-6 w-6 text-silver" />
            </Button>
          </div>
          <div className="border-b-2 border-whitesmoke" />
          <div className="p-4 md:p-8">
            <div className="my-4 grid items-center gap-4 text-primary">
              <Label htmlFor="휴대폰 번호">휴대폰 번호</Label>
              <div className="relative">
                <Input
                  value={phone}
                  onChange={handlePhoneChange}
                  name="phone"
                  placeholder="01012344321"
                />
                {isCounting ? (
                  <Button
                    type="button"
                    className="absolute right-2 top-1 h-8 w-20 rounded-lg bg-main text-white"
                  >
                    {formatTime(time)}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    disabled={!isValidPhone}
                    onClick={() => {
                      sendCode(phone)
                      setIsCounting(true)
                    }}
                    className="absolute right-2 top-1 h-8 rounded-lg bg-main text-white"
                  >
                    번호인증
                  </Button>
                )}
              </div>
            </div>
            <div className="my-4 grid items-center gap-4 text-primary">
              <Label htmlFor="휴대폰 번호">휴대폰 인증번호</Label>
              <div className="relative">
                <Input
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  name="code"
                  placeholder="013211"
                />
                <Button
                  type="button"
                  disabled={code.length !== 6 || isLoading}
                  onClick={() => {
                    checkCode(phone, code)
                  }}
                  className="absolute right-2 top-1 h-8 rounded-lg bg-main text-white"
                >
                  인증확인
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              className={`h-8 rounded-lg bg-main text-sm text-white`}
              onClick={closeDialog}
            >
              닫기
            </Button>
          </div>
        </DialogPanel>
      </form>
    </Dialog>
  )
}

export default PhoneDialog
