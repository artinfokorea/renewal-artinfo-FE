"use client";

import React from "react";

const MainRecruitContainer = () => {
  return (
    <section>
      <h3 className="text-xl font-bold">#채용</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-4 mb-12">
        <div className="border border-silver h-32 md:h-[220px]"></div>
        <div className="border border-silver h-32 md:h-[220px]"></div>
        {/* <div className="border border-silver h-32 md:h-[220px]"></div> */}
      </div>
    </section>
  );
};

export default MainRecruitContainer;
