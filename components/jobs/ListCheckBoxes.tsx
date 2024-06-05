import React from "react";
import { Label } from "../ui/label";
import {
  MajorType,
  RecruitType,
  MajorValues,
  recruitsValues,
} from "@/types/jobs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Props {
  checkedRecruits: RecruitType[];
  checkedMajors: MajorType[];
}

const ListCheckBoxes = ({ checkedRecruits, checkedMajors }: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const recruit = searchParams.get("recruit") as RecruitType;
  const major = searchParams.get("major") as MajorType;

  const handleRecruitChange = (value: RecruitType) => {
    if (recruit?.split(",").includes(value)) {
      const recruitList = recruit.split(",").filter((v) => v !== value);
      router.push(`${pathname}?recruit=${recruitList.join(",")}`);
    } else {
      router.push(
        `${pathname}?recruit=${recruit ? `${recruit},${value}` : value}`
      );
    }
  };

  const handleMajorChange = (value: MajorType) => {
    if (major?.split(",").includes(value)) {
      const majorList = major.split(",").filter((v) => v !== value);
      router.push(`${pathname}?major=${majorList.join(",")}`);
    } else {
      router.push(`${pathname}?major=${major ? `${major},${value}` : value}`);
    }
  };

  return (
    <form className="hidden lg:flex flex-col text-gray-400 min-w-[180px]">
      <div className="mt-8">
        <h4 className="text-lg font-semibold">직군</h4>

        {recruitsValues.map(({ title, value }) => (
          <div className="flex items-center my-2" key={value}>
            <input
              type="checkbox"
              value={value}
              checked={checkedRecruits.includes(value)}
              className="w-5 h-5 border-gray-400 checked:bg-main rounded"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleRecruitChange(value)
              }
            />
            <Label htmlFor={title} className="ml-2 text-lg">
              {title}
            </Label>
          </div>
        ))}
      </div>
      <div className="mt-12">
        <h4 className="text-lg font-semibold">전공</h4>

        {MajorValues.map(({ title, value, deps }) => {
          if (deps !== 2) {
            return (
              <div className="flex items-center my-2" key={value}>
                <input
                  type="checkbox"
                  value={value}
                  checked={checkedMajors.includes(value)}
                  className="w-5 h-5 border-gray-400 checked:bg-main rounded"
                  onChange={() => handleMajorChange(value)}
                />
                <Label htmlFor={title} className="ml-2 text-lg">
                  {title}
                </Label>
              </div>
            );
          } else {
            return (
              <div className="ml-8 flex items-center my-2" key={value}>
                <input
                  type="checkbox"
                  value={value}
                  checked={checkedMajors.includes(value)}
                  className="w-5 h-5 border-gray-400 checked:bg-main rounded"
                  onChange={() => handleMajorChange(value)}
                />
                <Label htmlFor={title} className="ml-2 text-lg">
                  {title}
                </Label>
              </div>
            );
          }
        })}
      </div>
    </form>
  );
};

export default ListCheckBoxes;
