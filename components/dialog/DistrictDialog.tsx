import React, { useEffect, useState } from "react"
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react"
import { Button } from "../ui/button"
import CloseIcon from "../icons/CloseIcon"
import { useQuery } from "@tanstack/react-query"
import { queries } from "@/lib/queries"
import { PROVINCE } from "@/types"
import LeftIcon from "../icons/LeftIcon"

interface Props {
  open: boolean
  close: () => void
  handleArea: (area: string) => void
}

const DistrictDialog = ({ open, close, handleArea }: Props) => {
  const [step, setStep] = useState(0)
  const [selectedProvince, setSelectedProvince] = useState<PROVINCE>()

  const { data: step1 } = useQuery(queries.provinces.list())

  const { data: step2 } = useQuery(queries.provinces.list(selectedProvince?.id))

  const selectProvince = (province: PROVINCE) => {
    setSelectedProvince(province)
    setStep(prev => prev + 1)
  }

  const selectDistrict = (district: PROVINCE) => {
    handleArea(`${selectedProvince?.name} ${district.name}`)
    setSelectedProvince(undefined)
    setStep(0)
    close()
  }

  const handleSelect = (province: PROVINCE) => {
    step === 0 ? selectProvince(province) : selectDistrict(province)
  }

  useEffect(() => {
    if (step2?.provinces && step2.provinces.length === 0 && selectedProvince) {
      handleArea(selectedProvince.name)
      setStep(0)
      close()
    }
  }, [step2])

  return (
    <Dialog
      open={open}
      onClose={close}
      className="relative z-50 flex items-center justify-center rounded-lg"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="z-10 mx-auto min-h-[350px] min-w-[300px] max-w-[650px] rounded-xl bg-white py-4">
          <div className="relative mb-4 w-full">
            {step === 1 && (
              <Button
                onClick={() => setStep(prev => prev - 1)}
                className="absolute -top-[6px] left-2"
              >
                <LeftIcon className="h-6 w-6 text-silver" />
              </Button>
            )}
            <DialogTitle className="flex-1 text-center font-semibold md:text-lg">
              지역선택
            </DialogTitle>
            <Button onClick={close} className="absolute -top-[8px] right-2">
              <CloseIcon className="h-6 w-6 text-silver" />
            </Button>
          </div>
          <div className="border-b-2 border-whitesmoke" />
          <div className="flex justify-center p-4 md:p-8">
            <div className="grid w-full grid-cols-5 gap-3 overflow-y-auto md:grid-cols-6 md:gap-4">
              {step === 0
                ? step1?.provinces.map(province => (
                    <Button
                      key={province.id}
                      onClick={() => handleSelect(province)}
                      className="h-8 rounded-full bg-blue-500 px-3 text-sm text-white hover:bg-main md:h-7 md:text-base"
                    >
                      {province.name.slice(0, 2)}
                    </Button>
                  ))
                : step2?.provinces.map(province => (
                    <Button
                      key={province.id}
                      onClick={() => handleSelect(province)}
                      className="h-8 rounded-full bg-blue-500 px-3 text-sm text-white hover:bg-main md:h-7 md:text-base"
                    >
                      {province.name.slice(0, 2)}
                    </Button>
                  ))}
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}

export default DistrictDialog
