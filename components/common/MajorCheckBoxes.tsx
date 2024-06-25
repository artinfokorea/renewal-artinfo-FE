import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MAJOR, MajorCategory, MajorCategoryValues } from "@/types";
import RightIcon from "../icons/RightIcon";
import CheckboxField from "./CheckboxField";

interface Props {
  majors?: MAJOR[];
}

const MajorCheckBoxes = ({ majors }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const majorIds = searchParams.getAll("majorId") as string[];
  const initialState: { [key: string]: boolean } = MajorCategoryValues.reduce<{
    [key: string]: boolean;
  }>((acc, curr) => {
    acc[curr.key] = false;
    return acc;
  }, {});
  const [checkedMajorIds, setCheckedMajorIds] = useState<string[]>(majorIds);
  const [isMajorCategoryDetail, setIsMajorCategoryDetail] =
    useState(initialState);
  const [isMajorCategoryChecked, setIsMajorCategoryChecked] =
    useState(initialState);

  useEffect(() => {
    const locationParams = new URLSearchParams(window.location.search);

    locationParams.delete("majorId");
    checkedMajorIds.forEach((v) => locationParams.append("majorId", v));
    const newUrl = `${window.location.pathname}?${locationParams.toString()}`;
    router.push(newUrl, {
      scroll: false,
    });
  }, [majorIds]);

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

  const handleMajorGroupChange = (key: MajorCategory) => {
    const categoryIds = majorCategoryIds[key] as string[];

    setIsMajorCategoryChecked((prev) => {
      return {
        ...prev,
        [key]: !prev[key],
      };
    });

    if (!isMajorCategoryChecked[key]) {
      setCheckedMajorIds((prev) => {
        return [...prev, ...categoryIds.filter((id) => !majorIds.includes(id))];
      });
    } else {
      setCheckedMajorIds((prev) => {
        return prev.filter((id) => !categoryIds.includes(id));
      });
    }
  };

  const handleMajorChange = (majorId: string) => {
    if (checkedMajorIds?.includes(majorId)) {
      setCheckedMajorIds((prev) => {
        return prev.filter((id) => id !== majorId);
      });
    } else {
      setCheckedMajorIds((prev) => {
        return [...prev, majorId];
      });
    }
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
    setIsMajorCategoryChecked(
      MajorCategoryValues.reduce<{
        [key: string]: boolean;
      }>((acc, curr) => {
        acc[curr.key] = false;
        return acc;
      }, {})
    );
    setCheckedMajorIds([]);
  };

  return (
    <div className="mt-12">
      <h4 className="text-lg font-semibold">전공</h4>
      <CheckboxField
        title="전체"
        checked={checkedMajorIds.length === 0}
        handleChange={handleIsAllMajorChecked}
      />
      {MajorCategoryValues.map(({ key, value }) => {
        return (
          <div key={value}>
            <CheckboxField<MajorCategory>
              value={key}
              title={value}
              checked={
                majorCategoryIds[key]?.every((id) =>
                  checkedMajorIds.includes(id)
                ) || false
              }
              handleChange={() => handleMajorGroupChange(key)}
            >
              <button
                type="button"
                className={`transform transition duration-200 ${
                  isMajorCategoryDetail[key] ? "rotate-90" : "rotate-0"
                }`}
                onClick={() => handleMajorDetailBoxes(key)}
              >
                <RightIcon className="w-5 h-5 text-gray-400" />
              </button>
            </CheckboxField>
            {isMajorCategoryDetail[key] &&
              majors?.map((major) => {
                if (major.enGroup === key) {
                  return (
                    <CheckboxField<number>
                      key={major.id}
                      value={major.id}
                      title={major.koName}
                      checked={
                        checkedMajorIds.includes(major.id.toString()) || false
                      }
                      handleChange={() =>
                        handleMajorChange(major.id.toString())
                      }
                      className="ml-8"
                    />
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
