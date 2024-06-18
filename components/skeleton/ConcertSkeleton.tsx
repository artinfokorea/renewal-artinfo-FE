import React from "react";

const ConcertSkeleton = () => {
  return (
    <section className="mt-8 py-6 gap-8 lg:gap-12 grid grid-cols-2 md:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => index).map((index) => (
        <div
          key={index}
          className={`h-[240px] md:h-[280px] skeleton-list-item rounded-md ${
            index < 2 ? "block" : "hidden md:block"
          }`}
        />
      ))}
    </section>
  );
};

export default ConcertSkeleton;
