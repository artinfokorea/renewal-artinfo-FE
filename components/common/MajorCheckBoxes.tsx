import { useEffect, useMemo, useState } from "react";
import { Label } from "../ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { MAJOR, MajorCategory, MajorCategoryValues } from "@/types";
import RightIcon from "../icons/RightIcon";

interface Props {
  majors?: MAJOR[];
}

const MajorCheckBoxes = ({ majors }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const majorIds = searchParams.getAll("majorId") as string[];
  const [isMajorAllChecked, setIsMajorAllChecked] = useState(
    majorIds.length === 0
  );
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

  useEffect(() => {
    majorIds.length === 0
      ? setIsMajorAllChecked(true)
      : setIsMajorAllChecked(false);
  }, [majorIds]);

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

      const filteredMajors = majors?.filter((major) => {
        if (major.enGroup !== key) return major.id;
      });
      const filterdMajorIds = majorIds.filter((id) =>
        filteredMajors?.some((major) => major.id === Number(id))
      );
      filterdMajorIds.forEach((id) =>
        locationParams.append("majorId", id.toString())
      );
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

  const majorCategoryIds = useMemo(() => {
    return {
      [MajorCategory.MUSIC_MAJOR_ETC]: majors
        ?.filter((major) => major.enGroup === MajorCategory.MUSIC_MAJOR_ETC)
        .map((major) => major.id.toString()),
      [MajorCategory.MUSIC_MAJOR_KEYBOARD]: majors
        ?.filter(
          (major) => major.enGroup === MajorCategory.MUSIC_MAJOR_KEYBOARD
        )
        .map((major) => major.id.toString()),
      [MajorCategory.MUSIC_MAJOR_VOCAL]: majors
        ?.filter((major) => major.enGroup === MajorCategory.MUSIC_MAJOR_VOCAL)
        .map((major) => major.id.toString()),
      [MajorCategory.MUSIC_MAJOR_ADMINISTRATION]: majors
        ?.filter(
          (major) => major.enGroup === MajorCategory.MUSIC_MAJOR_ADMINISTRATION
        )
        .map((major) => major.id.toString()),
      [MajorCategory.MUSIC_MAJOR_STRING]: majors
        ?.filter((major) => major.enGroup === MajorCategory.MUSIC_MAJOR_STRING)
        .map((major) => major.id.toString()),
      [MajorCategory.MUSIC_MAJOR_BRASS]: majors
        ?.filter((major) => major.enGroup === MajorCategory.MUSIC_MAJOR_BRASS)
        .map((major) => major.id.toString()),
      [MajorCategory.MUSIC_MAJOR_POPULAR_MUSIC]: majors
        ?.filter(
          (major) => major.enGroup === MajorCategory.MUSIC_MAJOR_POPULAR_MUSIC
        )
        .map((major) => major.id.toString()),
      [MajorCategory.MUSIC_MAJOR_TRADITIONAL_MUSIC]: majors
        ?.filter(
          (major) =>
            major.enGroup === MajorCategory.MUSIC_MAJOR_TRADITIONAL_MUSIC
        )
        .map((major) => major.id.toString()),
    };
  }, [majors]);

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

  const handleIsAllMajorChecked = () => {
    const locationParams = new URLSearchParams(window.location.search);
    locationParams.delete("majorId");
    setIsMajorCategoryChecked(
      MajorCategoryValues.reduce<{
        [key: string]: boolean;
      }>((acc, curr) => {
        acc[curr.key] = !isMajorAllChecked;
        return acc;
      }, {})
    );
    setIsMajorAllChecked(!isMajorAllChecked);
    const newUrl = `${window.location.pathname}?${locationParams.toString()}`;
    router.push(newUrl, {
      scroll: false,
    });
  };
  return (
    <div className="mt-12">
      <h4 className="text-lg font-semibold">전공</h4>
      <div className="flex items-center my-2">
        <input
          type="checkbox"
          checked={isMajorAllChecked}
          className="w-5 h-5 border-gray-400 checked:bg-main rounded"
          onChange={handleIsAllMajorChecked}
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
                checked={
                  majorCategoryIds[key]?.every((id) => majorIds.includes(id)) ||
                  false
                }
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
                    <div className="ml-8 flex items-center my-2" key={major.id}>
                      <input
                        type="checkbox"
                        value={major.id}
                        checked={
                          majorIds.includes(major.id.toString()) || false
                        }
                        className="w-5 h-5 border-gray-400 checked:bg-main rounded"
                        onChange={() => handleMajorChange(major.id.toString())}
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
      })}
    </div>
  );
};

export default MajorCheckBoxes;
