import React from "react";

const MainJobSkeleton = () => {
  return (
    <section>
      <div className="h-6 w-20 bg-gray-200 animate-pulse" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mt-4 mb-12 ">
        {Array.from({ length: 3 }, (_, index) => index).map((index) => (
          <div
            key={index}
            className={`h-[130px] md:h-[185px] w-full skeleton-list-item ${
              index < 2 ? "block" : "hidden md:block"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default MainJobSkeleton;
