import { MAJOR, MajorCategoryValues } from "@/types";
import React, { useState } from "react";
import RightIcon from "../icons/RightIcon";
import { useSearchParams } from "next/navigation";

interface Props {
  majors?: MAJOR[];
}

const MobileMajorFilter = ({ majors }: Props) => {
  const searchParams = useSearchParams();
  const majorIds = searchParams.getAll("majorId") as string[];
  const initialState: { [key: string]: boolean } = MajorCategoryValues.reduce<{
    [key: string]: boolean;
  }>((acc, curr) => {
    acc[curr.key] = false;
    return acc;
  }, {});
  const [isMajorCategoryDetail, setIsMajorCategoryDetail] =
    useState(initialState);

  const handleMajorDetailBoxes = (key: string) => {
    setIsMajorCategoryDetail((prev) => {
      return {
        ...prev,
        [key]: !prev[key],
      };
    });
  };

  return (
    <div className="py-4 px-2 flex flex-col gap-1">
      <button
        //   onClick={() => selecteRecruit(value)}
        className={`text-coolgray font-semibold py-1 px-4 text-left rounded-lg
          `}
      >
        전체
      </button>
      {MajorCategoryValues.map(({ key, value }) => {
        return (
          <div key={value}>
            <div className="flex items-center">
              <button
                key={value}
                className={`flex items-center gap-2 text-coolgray font-semibold py-1 px-4 text-left rounded-lg
          ${majorIds.includes(value) && "bg-whitesmoke"} `}
                onClick={() => handleMajorDetailBoxes(key)}
              >
                {value}
                <RightIcon
                  className={`w-4 h-4 text-coolgray transform transition duration-200 ${
                    isMajorCategoryDetail[key] ? "rotate-90" : "rotate-0"
                  }`}
                />
              </button>
            </div>
            {isMajorCategoryDetail[key] &&
              majors?.map((major) => {
                if (major.enGroup === key) {
                  return (
                    <div className="ml-8 flex items-center my-2" key={major.id}>
                      <button
                        type="button"
                        className={`transform transition duration-200 ${
                          isMajorCategoryDetail[key] ? "rotate-90" : "rotate-0"
                        }`}
                        onClick={() => handleMajorDetailBoxes(key)}
                      >
                        <RightIcon className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  );
                }
              })}
          </div>
        );
      })}
    </div>
  );
};

export default MobileMajorFilter;
