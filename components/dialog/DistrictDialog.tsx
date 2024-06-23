import React, { useEffect, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { Button } from '../ui/button';
import CloseIcon from '../icons/CloseIcon';
import { useQuery } from '@tanstack/react-query';
import { queries } from '@/lib/queries';
import { PROVINCE } from '@/types';
import LeftIcon from '../icons/LeftIcon';

interface Props {
  open: boolean;
  close: () => void;
  handleArea: (area: string) => void;
}

const DistrictDialog = ({ open, close, handleArea }: Props) => {
  const [step, setStep] = useState(0);
  const [selectedProvince, setSelectedProvince] = useState<PROVINCE>();

  const { data: step1 } = useQuery(queries.provinces.list());

  const { data: step2 } = useQuery(
    queries.provinces.list(selectedProvince?.id)
  );

  const selectProvince = (province: PROVINCE) => {
    setSelectedProvince(province);
    setStep((prev) => prev + 1);
  };

  const selectDistrict = (district: PROVINCE) => {
    handleArea(`${selectedProvince?.name} ${district.name}`);
    setSelectedProvince(undefined);
    setStep(0);
    close();
  };

  const handleSelect = (province: PROVINCE) => {
    step === 0 ? selectProvince(province) : selectDistrict(province);
  };

  return (
    <Dialog
      open={open}
      onClose={close}
      className="relative z-50 flex items-center justify-center rounded-lg"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="z-10 min-w-[300px] max-w-[650px] min-h-[350px] bg-white rounded-xl py-4 mx-auto">
          <div className="relative mb-4">
            {step === 1 && (
              <Button
                onClick={() => setStep((prev) => prev - 1)}
                className="absolute -top-[6px] left-2"
              >
                <LeftIcon className=" w-6 h-6 text-silver" />
              </Button>
            )}
            <DialogTitle className=" flex-1 md:text-lg text-center font-semibold ">
              지역선택
            </DialogTitle>
            <Button onClick={close} className="absolute -top-[8px] right-2">
              <CloseIcon className=" w-6 h-6 text-silver" />
            </Button>
          </div>
          <div className="border-b-2 border-whitesmoke" />
          <div className="p-4 md:p-8 flex justify-center">
            <div className="grid grid-cols-5 md:grid-cols-6 gap-3 md:gap-4 overflow-y-auto">
              {step === 0
                ? step1?.provinces.map((province) => (
                    <Button
                      key={province.id}
                      onClick={() => handleSelect(province)}
                      className="bg-blue-500 text-white text-sm h-8 md:text-base md:h-7 px-3 rounded-full hover:bg-main"
                    >
                      {province.name.slice(0, 2)}
                    </Button>
                  ))
                : step2?.provinces.map((province) => (
                    <Button
                      key={province.id}
                      onClick={() => handleSelect(province)}
                      className="bg-blue-500 text-white text-sm h-8 md:text-base md:h-7 px-3 rounded-full hover:bg-main"
                    >
                      {province.name.slice(0, 2)}
                    </Button>
                  ))}
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default DistrictDialog;
