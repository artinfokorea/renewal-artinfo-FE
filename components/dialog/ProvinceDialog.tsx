import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import React, { useEffect, useState } from 'react';
import CloseIcon from '../icons/CloseIcon';
import { Button } from '../ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { PROVINCE } from '@/types';

interface Props {
  provinces?: PROVINCE[];
  open: boolean;
  close: () => void;
  multiple?: boolean;
}

const ProvinceDialog = ({ open, close, multiple, provinces }: Props) => {
  const searchParams = useSearchParams();
  const provinceIds = searchParams.getAll('provinceId');
  const router = useRouter();
  const [selectedProvinceIds, setSelectedProvinceIds] = useState<string[]>([]);

  useEffect(() => {
    if (open) setSelectedProvinceIds(provinceIds);
  }, [open]);

  const selectProvince = (provinceId: string) => {
    if (selectedProvinceIds.includes(provinceId)) {
      setSelectedProvinceIds(
        selectedProvinceIds.filter((id) => id !== provinceId)
      );
    } else {
      setSelectedProvinceIds([...selectedProvinceIds, provinceId]);
    }
  };

  const selectComplete = () => {
    const locationParams = new URLSearchParams(window.location.search);

    if (selectedProvinceIds.length > 0) {
      locationParams.delete('provinceId');
      selectedProvinceIds.forEach((id) => {
        locationParams.append('provinceId', id);
      });
    } else {
      locationParams.delete('provinceId');
    }
    const newUrl = `${window.location.pathname}?${locationParams.toString()}`;
    router.push(newUrl, {
      scroll: false,
    });
    close();
  };

  return (
    <Dialog
      open={open}
      onClose={close}
      className="relative z-50 flex items-center justify-center rounded-lg"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="z-10 max-w-[650px] h-[300px] bg-white rounded-xl py-4 mx-auto">
          <div className="relative mb-4">
            <DialogTitle className=" flex-1 md:text-lg text-center font-semibold ">
              지역선택
            </DialogTitle>
            <Button onClick={close} className="absolute -top-[8px] right-2">
              <CloseIcon className=" w-6 h-6 text-silver" />
            </Button>
          </div>
          <div className="border-b-2 border-whitesmoke" />
          <div className="p-4 md:p-8 flex justify-center">
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3 md:gap-4">
              {provinces?.map((province) => (
                <Button
                  key={province.id}
                  onClick={() => selectProvince(province.id.toString())}
                  className={`text-white text-sm h-6 md:text-base md:h-7 px-3 rounded-xl
                    ${
                      !multiple
                        ? 'bg-main'
                        : selectedProvinceIds.includes(province.id.toString())
                        ? 'bg-main'
                        : 'bg-indigo-100'
                    }    
                          `}
                >
                  {province.name.slice(0, 2)}
                </Button>
              ))}
            </div>
          </div>

          {multiple && (
            <div className="flex justify-center">
              <Button
                className={` text-white rounded-lg text-sm bg-main h-8`}
                onClick={selectComplete}
              >
                선택 완료
              </Button>
            </div>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ProvinceDialog;
