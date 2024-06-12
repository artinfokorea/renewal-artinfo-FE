import { queries } from "@/lib/queries";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import CloseIcon from "../icons/CloseIcon";
import { Button } from "../ui/button";
import { MAJOR, MajorCategoryValues } from "@/types";

interface Props {
  open: boolean;
  close: () => void;
  selectedMajors: MAJOR[];
  handleSelectMajor: (major: MAJOR) => void;
}

const MajorDialog = ({
  open,
  close,
  selectedMajors,
  handleSelectMajor,
}: Props) => {
  const { data } = useQuery(queries.majors.list());

  return (
    <Dialog
      open={open}
      onClose={close}
      className="fixed z-10 bg-whitesmoke  flex items-center justify-center  inset-0 rounded-lg"
    >
      <DialogPanel className="max-w-[650px] h-[500px] md:h-[800px] bg-white rounded-xl py-4 overflow-auto mx-4 md:mx-0">
        <div className="relative mb-4">
          <DialogTitle className=" flex-1 md:text-lg text-center font-semibold ">
            전공선택
          </DialogTitle>
          <Button onClick={close} className="absolute -top-[8px] right-2">
            <CloseIcon className=" w-6 h-6 text-silver" />
          </Button>
        </div>
        <div className="border-b-2 border-whitesmoke" />
        <div className="p-4 md:p-8">
          {MajorCategoryValues.map(({ key, value }) => (
            <div key={key} className="flex flex-col gap-2 my-2">
              <span className="text-coolgray font-bold">{value}</span>
              <div className="flex flex-wrap gap-2">
                {data?.majors.map((major) => {
                  return (
                    major.enGroup === key && (
                      <Button
                        key={major.id}
                        onClick={() => handleSelectMajor(major)}
                        className={`text-white text-sm h-6 md:text-base md:h-7 px-3 rounded-xl ${
                          selectedMajors.includes(major)
                            ? "bg-main "
                            : "bg-lavender"
                        }`}
                      >
                        {major.koName}
                      </Button>
                    )
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <Button
            disabled={selectedMajors.length === 0}
            className={` text-white rounded-lg text-sm bg-main h-8`}
            onClick={close}
          >
            선택 완료
          </Button>
        </div>
      </DialogPanel>
    </Dialog>
  );
};

export default MajorDialog;
