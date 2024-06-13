import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { JobType, jobTypessValues } from "@/types/jobs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MAJOR, MajorCategoryValues } from "@/types";
import RightIcon from "../icons/RightIcon";

interface Props {
  majors?: MAJOR[];
}

const ListCheckBoxes = ({ majors }: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isMajorAllChecked, setIsMajorAllChecked] = useState(false);
  const router = useRouter();
  const recruits = searchParams.getAll("recruit") as JobType[];
  const majorIds = searchParams.getAll("majorId") as string[];
  const initialState: { [key: string]: boolean } = MajorCategoryValues.reduce<{
    [key: string]: boolean;
  }>((acc, curr) => {
    acc[curr.key] = false;
    return acc;
  }, {});
  const [isMajorCategoryDetail, setIsMajorCategoryDetail] =
    useState(initialState);
  const [isMajorCategoryChecked, setIsMajorCategoryChecked] =
    useState(initialState);

  const handleRecruitChange = (value: JobType) => {
    const locationParams = new URLSearchParams(window.location.search);

    if (recruits?.includes(value)) {
      locationParams.delete("recruit");
      const recruitList = recruits.filter((v) => v !== value);
      recruitList.forEach((v) => locationParams.append("recruit", v));
    } else {
      locationParams.append("recruit", value);
    }
    const newUrl = `${window.location.pathname}?${locationParams.toString()}`;
    router.push(newUrl, {
      scroll: false,
    });
  };

  const handleMajorChange = (majorId: string) => {
    const locationParams = new URLSearchParams(window.location.search);
    if (majorIds?.includes(majorId)) {
      locationParams.delete("majorId");
      const majorList = majorIds.filter((v) => v !== majorId);
      majorList.forEach((v) => locationParams.append("majorId", v));
    } else {
      locationParams.append("majorId", majorId);
    }
    const newUrl = `${window.location.pathname}?${locationParams.toString()}`;
    router.push(newUrl, {
      scroll: false,
    });
  };

  const handleMajorDetailBoxes = (key: string) => {
    setIsMajorCategoryDetail((prev) => {
      return {
        ...prev,
        [key]: !prev[key],
      };
    });
  };

  const handleMajorGroupChange = (key: string) => {
    const locationParams = new URLSearchParams(window.location.search);

    if (!isMajorCategoryChecked[key]) {
      majors
        ?.filter((major) => major.enGroup === key)
        .forEach((major) => {
          locationParams.append("majorId", major.id.toString());
        });
    } else {
      locationParams.delete("majorId");
      console.log("majorIds", majorIds);
      // majors
      //   ?.filter((major) => major.enGroup !== key)
      //   .forEach((major) => {
      //     locationParams.append("majorId", major.id.toString());
      //   });
    }

    setIsMajorCategoryChecked((prev) => {
      return {
        ...prev,
        [key]: !prev[key],
      };
    });

    const newUrl = `${window.location.pathname}?${locationParams.toString()}`;
    router.push(newUrl, {
      scroll: false,
    });
  };

  useEffect(() => {
    if (isMajorAllChecked) {
      const locationParams = new URLSearchParams(window.location.search);
      locationParams.delete("majorId");
      majors?.forEach((major) => {
        locationParams.append("majorId", major.id.toString());
      });
      const newUrl = `${window.location.pathname}?${locationParams.toString()}`;
      router.push(newUrl, {
        scroll: false,
      });
    } else {
      const locationParams = new URLSearchParams(window.location.search);
      locationParams.delete("majorId");
      const newUrl = `${window.location.pathname}?${locationParams.toString()}`;
      router.push(newUrl, {
        scroll: false,
      });
    }
  }, [isMajorAllChecked]);

  return (
    <form className="hidden lg:flex flex-col text-gray-400 min-w-[180px]">
      <div className="mt-8">
        <h4 className="text-lg font-semibold">직군</h4>

        {jobTypessValues.map(({ title, value }) => (
          <div className="flex items-center my-2" key={value}>
            <input
              type="checkbox"
              value={value}
              checked={recruits.includes(value)}
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
        <div className="flex items-center my-2">
          <input
            type="checkbox"
            checked={isMajorAllChecked}
            className="w-5 h-5 border-gray-400 checked:bg-main rounded"
            onChange={() => setIsMajorAllChecked(!isMajorAllChecked)}
          />
          <Label htmlFor="전채" className="ml-2 text-lg">
            전체
          </Label>
        </div>
        {MajorCategoryValues.map(({ key, value }) => {
          return (
            <div key={value}>
              <div className="flex items-center my-2 gap-2">
                <input
                  type="checkbox"
                  value={key}
                  // checked={majorIds.includes(major.id.toString())}
                  className="w-5 h-5 border-gray-400 checked:bg-main rounded"
                  onChange={() => handleMajorGroupChange(key)}
                />
                <Label htmlFor={value} className="text-lg">
                  {value}
                </Label>

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
              {isMajorCategoryDetail[key] &&
                majors?.map((major) => {
                  if (major.enGroup === key) {
                    return (
                      <div
                        className="ml-8 flex items-center my-2"
                        key={major.id}
                      >
                        <input
                          type="checkbox"
                          value={major.id}
                          checked={majorIds.includes(major.id.toString())}
                          className="w-5 h-5 border-gray-400 checked:bg-main rounded"
                          onChange={() =>
                            handleMajorChange(major.id.toString())
                          }
                        />
                        <Label htmlFor={major.koName} className="ml-2 text-lg">
                          {major.koName}
                        </Label>
                      </div>
                    );
                  }
                })}
            </div>
          );
          // return (
          //   <div className="flex items-center my-2" key={major.id}>
          //     <input
          //       type="checkbox"
          //       value={major.id}
          //       checked={majorIds.includes(major.id.toString())}
          //       className="w-5 h-5 border-gray-400 checked:bg-main rounded"
          //       onChange={() => handleMajorChange(major.id.toString())}
          //     />
          //     <Label htmlFor={major.koName} className="ml-2 text-lg">
          //       {major.koName}
          //     </Label>
          //   </div>
          // );
          // if (deps !== 2) {
          //   return (
          //     <div className="flex items-center my-2" key={value}>
          //       <input
          //         type="checkbox"
          //         value={value}
          //         checked={majorIds.includes(value)}
          //         className="w-5 h-5 border-gray-400 checked:bg-main rounded"
          //         onChange={() => handleMajorChange(value)}
          //       />
          //       <Label htmlFor={title} className="ml-2 text-lg">
          //         {title}
          //       </Label>
          //     </div>
          //   );
          // } else {
          //   return (
          //     <div className="ml-8 flex items-center my-2" key={value}>
          //       <input
          //         type="checkbox"
          //         value={value}
          //         checked={majorIds.includes(value)}
          //         className="w-5 h-5 border-gray-400 checked:bg-main rounded"
          //         onChange={() => handleMajorChange(value)}
          //       />
          //       <Label htmlFor={title} className="ml-2 text-lg">
          //         {title}
          //       </Label>
          //     </div>
          //   );
          // }
        })}
      </div>
    </form>
  );
};

export default ListCheckBoxes;
