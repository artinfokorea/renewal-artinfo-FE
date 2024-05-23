import React from "react";
import { Label } from "../ui/label";
import {
  MajorType,
  RecruitType,
  MajorValues,
  recruitsValues,
} from "@/types/recruits";

interface Props {
  checkedRecruits: RecruitType[];
  checkedMajors: MajorType[];
  handleRecruit: (checked: boolean, value: RecruitType) => void;
  handleMajor: (checked: boolean, value: MajorType) => void;
}

const ListCheckBoxes = ({
  handleRecruit,
  handleMajor,
  checkedRecruits,
  checkedMajors,
}: Props) => {
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
                handleRecruit(e.target.checked, value)
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleMajor(e.target.checked, value)
                  }
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleMajor(e.target.checked, value)
                  }
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
