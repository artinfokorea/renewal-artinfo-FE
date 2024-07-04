import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react"
import React, { useEffect, useState } from "react"
import CloseIcon from "../icons/CloseIcon"
import { Button } from "../ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { PROVINCE } from "@/types"

interface Props {
  provinces?: PROVINCE[]
  open: boolean
  close: () => void
  multiple?: boolean
}

const ProvinceDialog = ({ open, close, multiple, provinces }: Props) => {
  const searchParams = useSearchParams()
  const provinceIds = searchParams.getAll("provinceId")
  const router = useRouter()
  const [selectedProvinceIds, setSelectedProvinceIds] =
    useState<string[]>(provinceIds)

  useEffect(() => {
    if (open) setSelectedProvinceIds(provinceIds)
  }, [open])

  const selectProvince = (provinceId: string) => {
    if (selectedProvinceIds.includes(provinceId)) {
      setSelectedProvinceIds(
        selectedProvinceIds.filter(id => id !== provinceId),
      )
    } else {
      setSelectedProvinceIds([...selectedProvinceIds, provinceId])
    }
  }

  const selecteComplete = () => {
    const locationParams = new URLSearchParams(window.location.search)

    if (selectedProvinceIds.length > 0) {
      locationParams.delete("provinceId")
      selectedProvinceIds.forEach(id => {
        locationParams.append("provinceId", id)
      })
    } else {
      locationParams.delete("provinceId")
    }
    const newUrl = `${window.location.pathname}?${locationParams.toString()}`

    router.push(newUrl, {
      scroll: false,
    })
    close()
  }

  return (
    <Dialog
      open={open}
      onClose={close}
      className="relative z-50 flex items-center justify-center rounded-lg"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="z-10 mx-auto h-[300px] max-w-[650px] rounded-xl bg-white py-4">
          <div className="relative mb-4">
            <DialogTitle className="flex-1 text-center font-semibold md:text-lg">
              지역선택
            </DialogTitle>
            <Button onClick={close} className="absolute -top-[8px] right-2">
              <CloseIcon className="h-6 w-6 text-silver" />
            </Button>
          </div>
          <div className="border-b-2 border-whitesmoke" />
          <div className="flex justify-center p-4 md:p-8">
            <div className="grid grid-cols-4 gap-4 md:grid-cols-6 md:gap-4">
              <Button
                onClick={() => setSelectedProvinceIds([])}
                className={`h-6 rounded-xl px-3 text-base text-white md:h-7 md:text-base ${
                  selectedProvinceIds.length === 0 ? "bg-main" : "bg-indigo-100"
                }`}
              >
                전체
              </Button>
              {provinces?.map(province => (
                <Button
                  key={province.id}
                  onClick={() => selectProvince(province.id.toString())}
                  className={`h-6 rounded-xl px-3 text-sm text-white md:h-7 md:text-base ${
                    !multiple
                      ? "bg-main"
                      : selectedProvinceIds.includes(province.id.toString())
                        ? "bg-main"
                        : "bg-indigo-100"
                  } `}
                >
                  {province.name.slice(0, 2)}
                </Button>
              ))}
            </div>
          </div>

          {multiple && (
            <div className="flex justify-center">
              <Button
                type="button"
                className={`h-8 rounded-lg bg-main text-sm text-white`}
                onClick={selecteComplete}
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

export default ProvinceDialog
