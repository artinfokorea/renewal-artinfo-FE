import { MAJOR, MajorCategoryValues } from "@/types";
import React, { useEffect, useState } from "react";
import RightIcon from "../icons/RightIcon";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  majors?: MAJOR[];
}

const MobileMajorFilter = ({ majors }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const majorIds = searchParams.getAll("majorId") as string[];
  const [isAllChecked, setIsAllChecked] = useState(majorIds.length === 0);
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

  useEffect(() => {
    majorIds.length === 0 ? setIsAllChecked(true) : setIsAllChecked(false);
  }, [majorIds]);

  const handleMajor = (majorId: string) => {
    const locationParams = new URLSearchParams(window.location.search);
    if (majorIds.includes(majorId)) {
      locationParams.delete("majorId");
      const newMajorIds = majorIds.filter((id) => id !== majorId);
      newMajorIds.forEach((id) => {
        if (id !== majorId) {
          locationParams.append("majorId", id);
        }
      });
    } else {
      locationParams.append("majorId", majorId);
    }
    const newUrl = `${window.location.pathname}?${locationParams.toString()}`;
    router.push(newUrl, {
      scroll: false,
    });
  };

  return (
    <div className="py-4 px-2 flex flex-col gap-1">
      <button
        onClick={() => setIsAllChecked(!isAllChecked)}
        className={`text-coolgray font-semibold py-1 px-4 text-left rounded-lg ${
          isAllChecked && "bg-whitesmoke"
        }
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
                        className={`text-coolgray font-semibold px-4 py-1 w-full text-left rounded-lg ${
                          majorIds.includes(major.id.toString()) &&
                          "bg-whitesmoke"
                        }`}
                        onClick={() => handleMajor(major.id.toString())}
                      >
                        {major.koName}
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
