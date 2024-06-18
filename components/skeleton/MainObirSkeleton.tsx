import React from "react";

const MainObirSkeleton = () => {
  return (
    <section className="my-8 md:my-12">
      <div className="h-6 w-20 bg-gray-200 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6 mt-4 mb-12">
        {Array.from({ length: 3 }, (_, index) => index).map((index) => (
          <div key={index} className={`h-[66px] w-full skeleton-list-item`} />
        ))}
      </div>
    </section>
  );
};

export default MainObirSkeleton;
