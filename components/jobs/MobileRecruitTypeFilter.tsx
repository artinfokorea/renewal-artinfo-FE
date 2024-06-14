import { JobType, JobTypeList } from "@/types/jobs";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const MobileRecruitTypeFilter = () => {
  const searchParams = useSearchParams();
  const recruits = searchParams.getAll("recruit") as JobType[];
  const router = useRouter();

  const selecteRecruit = (recruit: JobType) => {
    const locationParams = new URLSearchParams(window.location.search);
    if (recruits.includes(recruit)) {
      locationParams.delete("recruit");
      const newRecruits = recruits.filter((r) => r !== recruit);
      newRecruits.forEach((recruit) => {
        locationParams.append("recruit", recruit);
      });
    } else {
      locationParams.append("recruit", recruit);
    }
    const newUrl = `${window.location.pathname}?${locationParams.toString()}`;
    router.push(newUrl, {
      scroll: false,
    });
  };

  return (
    <div className="py-4 px-2 flex flex-col gap-1">
      {JobTypeList.map(({ title, value }) => (
        <button
          key={value}
          onClick={() => selecteRecruit(value)}
          className={`text-coolgray font-semibold py-2 px-4 text-left rounded-lg
          ${recruits.includes(value) && "bg-whitesmoke"}`}
        >
          {title}
        </button>
      ))}
    </div>
  );
};

export default MobileRecruitTypeFilter;
