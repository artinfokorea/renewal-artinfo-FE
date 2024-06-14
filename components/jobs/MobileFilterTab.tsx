import { MAJOR, PROVINCE } from "@/types";
import { SearchType } from "@/types/jobs";
import React, { useState } from "react";
import MobileRecruitTypeFilter from "./MobileRecruitTypeFilter";
import MobileProvinceFilter from "./MobileProvinceFilter";
import MobileMajorFilter from "./MobileMajorFilter";

interface Props {
  majors?: MAJOR[];
  provinces?: PROVINCE[];
}

const MobileFilterTab = ({ majors, provinces }: Props) => {
  const [mobileSearchTab, setMobileSearchTab] = useState<SearchType>();

  const handleSearchTab = (searchType: SearchType) => {
    if (mobileSearchTab === searchType) {
      setMobileSearchTab(undefined);
    } else {
      setMobileSearchTab(searchType);
    }
  };

  return (
    <div className="flex flex-col lg:hidden border relative">
      <div className="grid grid-cols-3 text-main  text-sm">
        <button
          onClick={() => handleSearchTab(SearchType.RECRUIT)}
          className={`py-2 rounded ${
            mobileSearchTab === SearchType.RECRUIT && "bg-whitesmoke"
          }`}
        >
          직군
        </button>
        <button
          onClick={() => handleSearchTab(SearchType.REGION)}
          className={`py-2 rounded ${
            mobileSearchTab === SearchType.REGION && "bg-whitesmoke"
          }`}
        >
          지역
        </button>
        <button
          onClick={() => handleSearchTab(SearchType.MAJOR)}
          className={`py-2 rounded ${
            mobileSearchTab === SearchType.MAJOR && "bg-whitesmoke"
          }`}
        >
          전공
        </button>
      </div>

      {mobileSearchTab === SearchType.RECRUIT && <MobileRecruitTypeFilter />}
      {mobileSearchTab === SearchType.REGION && (
        <MobileProvinceFilter provinces={provinces} />
      )}
      {mobileSearchTab === SearchType.MAJOR && (
        <MobileMajorFilter majors={majors} />
      )}
    </div>
  );
};

export default MobileFilterTab;
