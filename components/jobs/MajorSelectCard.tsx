import React from "react";
import { Button } from "../ui/button";
import CloseIcon from "../icons/CloseIcon";
import { useRouter } from "next/navigation";
import { jobTypessValues } from "@/types/jobs";

const MajorSelectCard = () => {
  const router = useRouter();

  return (
    <div
      className="bg-whitesmoke flex items-center justify-center"
      style={{ height: "calc(100vh - 56px)" }}
    >
      <div className="bg-white max-w-screen-md rounded-xl">
        <div className="flex justify-center items-center relative h-14">
          <h5 className="font-bold text-center flex-1 text-sm md:text-lg">
            전공 선택
          </h5>
          <Button
            className="absolute top-2 right-0 text-silver"
            onClick={() => router.back()}
          >
            <CloseIcon className="w-5 h-5" />
          </Button>
        </div>
        <div className="border-whitesmoke border-b-[3px]" />
        <div className="px-4 md:px-12 py-12">
          {jobTypessValues.map((type) => (
            <Button
              key={type.value}
              className="text-white text-xs md:text-sm bg-main w-[72px] md:w-[100px] h-10 rounded-3xl mx-1 md:mx-4"
            >
              {type.title}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MajorSelectCard;
