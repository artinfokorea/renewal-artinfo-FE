import { MAJOR, PROVINCE } from '@/types';
import { SearchType } from '@/types/jobs';
import React, { useState } from 'react';
import MobileProvinceFilter from '../common/MobileProvinceFilter';
import MobileMajorFilter from '../common/MobileMajorFilter';
import MobileRecruitTypeFilter from '../jobs/MobileRecruitTypeFilter';

interface Props {
  majors?: MAJOR[];
  provinces?: PROVINCE[];
  page: 'LESSON' | 'JOB';
}

const MobileFilterTab = ({ majors, provinces, page }: Props) => {
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
      <div
        className={`grid text-main text-sm ${
          page === 'JOB' ? 'grid-cols-3' : 'grid-cols-2'
        }`}
      >
        {page === 'JOB' && (
          <button
            onClick={() => handleSearchTab(SearchType.RECRUIT)}
            className={`py-2 rounded ${
              mobileSearchTab === SearchType.RECRUIT && 'bg-whitesmoke'
            }`}
          >
            직군
          </button>
        )}
        <button
          onClick={() => handleSearchTab(SearchType.REGION)}
          className={`py-2 rounded ${
            mobileSearchTab === SearchType.REGION && 'bg-whitesmoke'
          }`}
        >
          지역
        </button>
        <button
          onClick={() => handleSearchTab(SearchType.MAJOR)}
          className={`py-2 rounded ${
            mobileSearchTab === SearchType.MAJOR && 'bg-whitesmoke'
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
