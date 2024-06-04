"use client";

import React, { useState } from "react";
import ListSearchForm from "./ListSearchForm";
import ListCheckBoxes from "./ListCheckBoxes";
import { MajorType, RecruitType, MajorValues } from "@/types/jobs";

const ListContainer = () => {
  const [checkedRecruits, setCheckedRecruits] = useState<RecruitType[]>([]);
  const [checkedMajors, setCheckedMajors] = useState<MajorType[]>([]);

  const handleRecruitChange = (checked: boolean, value: RecruitType) => {
    if (checked) {
      setCheckedRecruits((prev) => [...prev, value]);
    } else {
      setCheckedRecruits((prev) => prev.filter((v) => v !== value));
    }
  };

  const handleMajorChange = (checked: boolean, value: MajorType) => {
    if (value === MajorType.ALL && checked) {
      MajorValues.map(({ value }) => {
        setCheckedMajors((prev) => [...prev, value]);
      });
      return;
    } else if (value === MajorType.ALL && !checked) {
      setCheckedMajors([]);
      return;
    }

    if (checked) {
      setCheckedMajors((prev) => [...prev, value]);
    } else {
      setCheckedMajors((prev) => prev.filter((v) => v !== value));
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto px-2">
      <ListSearchForm />
      <section className="flex">
        <ListCheckBoxes
          checkedRecruits={checkedRecruits}
          checkedMajors={checkedMajors}
          handleRecruit={handleRecruitChange}
          handleMajor={handleMajorChange}
        />
        <div className="flex-1 bg-yellow-100">bye</div>
      </section>
    </div>
  );
};

export default ListContainer;
