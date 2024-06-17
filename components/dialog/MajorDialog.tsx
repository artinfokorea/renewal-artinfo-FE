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
  multiple?: boolean;
}

const MajorDialog = ({
  open,
  close,
  selectedMajors,
  handleSelectMajor,
  multiple,
}: Props) => {
  const { data } = useQuery(queries.majors.list());

  const selectMajor = (major: MAJOR) => {
    handleSelectMajor(major);
    if (!multiple) close();
  };

  const selectedMajorIds = selectedMajors.map((major) => major.id);

  return (
    <Dialog
      open={open}
      onClose={close}
      className="relative z-50 flex items-center justify-center rounded-lg"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="z-10 max-w-[650px] h-[500px] md:h-[800px] bg-white rounded-xl py-4 overflow-auto mx-auto">
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
                          onClick={() => selectMajor(major)}
                          className={`text-white text-sm h-6 md:text-base md:h-7 px-3 rounded-xl
                          ${
                            selectedMajorIds.includes(major.id)
                              ? "bg-main"
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
          {multiple && (
            <div className="flex justify-center">
              <Button
                className={` text-white rounded-lg text-sm bg-main h-8`}
                onClick={close}
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

export default MajorDialog;
