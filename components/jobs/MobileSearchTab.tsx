import { SearchType } from "@/types/jobs";
import React, { useState } from "react";

const MobileSearchTab = () => {
  const [mobileSearchTab, setMobileSearchTab] = useState<SearchType>();

  const handleSearchTab = (searchType: SearchType) => {
    if (mobileSearchTab === searchType) {
      setMobileSearchTab(undefined);
    } else {
      setMobileSearchTab(searchType);
    }
  };

  return (
    <div className="flex flex-col md:hidden border">
      <div className="grid grid-cols-3 text-main py-2 text-sm">
        <button onClick={() => handleSearchTab(SearchType.JOB)}>직군</button>
        <button onClick={() => handleSearchTab(SearchType.REGION)}>지역</button>
        <button onClick={() => handleSearchTab(SearchType.MAJOR)}>전공</button>
      </div>
      <div>
        {mobileSearchTab === SearchType.JOB && <div>Content 1</div>}
        {mobileSearchTab === SearchType.REGION && <div>Content 2</div>}
        {mobileSearchTab === SearchType.MAJOR && <div>Content 3</div>}
      </div>
    </div>
  );
};

export default MobileSearchTab;
