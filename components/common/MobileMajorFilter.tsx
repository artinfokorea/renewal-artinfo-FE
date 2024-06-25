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
  const initialState: { [key: string]: boolean } = MajorCategoryValues.reduce<{
    [key: string]: boolean;
  }>((acc, curr) => {
    acc[curr.key] = false;
    return acc;
  }, {});
  const [isMajorCategoryDetail, setIsMajorCategoryDetail] =
    useState(initialState);
  const [checkedMajorIds, setCheckedMajorIds] = useState<string[]>(majorIds);

  useEffect(() => {
    const locationParams = new URLSearchParams(window.location.search);

    locationParams.delete("majorId");
    checkedMajorIds.forEach((v) => locationParams.append("majorId", v));
    const newUrl = `${window.location.pathname}?${locationParams.toString()}`;
    router.push(newUrl, {
      scroll: false,
    });
  }, [majorIds]);

  const handleMajorDetailBoxes = (key: string) => {
    setIsMajorCategoryDetail((prev) => {
      return {
        ...prev,
        [key]: !prev[key],
      };
    });
  };

  const handleMajor = (majorId: string) => {
    if (checkedMajorIds.includes(majorId)) {
      setCheckedMajorIds(checkedMajorIds.filter((v) => v !== majorId));
    } else {
      setCheckedMajorIds([...checkedMajorIds, majorId]);
    }
  };

  return (
    <div className="py-4 px-2 flex flex-col gap-1">
      <button
        onClick={() => setCheckedMajorIds([])}
        className={`text-coolgray font-semibold py-1 px-4 text-left rounded-lg ${
          checkedMajorIds.length === 0 && "bg-whitesmoke"
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
          ${checkedMajorIds.includes(value) && "bg-whitesmoke"} `}
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
                          checkedMajorIds.includes(major.id.toString()) &&
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
