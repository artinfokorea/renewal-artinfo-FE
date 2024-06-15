import { PROVINCE } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

interface Props {
  provinces?: PROVINCE[];
}

const MobileProvinceFilter = ({ provinces }: Props) => {
  const searchParams = useSearchParams();
  const provinceIds = searchParams.getAll("provinceId");
  const router = useRouter();

  const selectProvince = (provinceId: string) => {
    const locationParams = new URLSearchParams(window.location.search);
    if (provinceIds.includes(provinceId)) {
      locationParams.delete("provinceId");
      const newProvinceIds = provinceIds.filter((r) => r !== provinceId);
      newProvinceIds.forEach((provinceId) => {
        locationParams.append("provinceId", provinceId);
      });
    } else {
      locationParams.append("provinceId", provinceId);
    }
    const newUrl = `${window.location.pathname}?${locationParams.toString()}`;
    router.push(newUrl, {
      scroll: false,
    });
  };

  return (
    <div className="py-4 px-2 grid grid-cols-5 gap-1">
      {provinces?.map((province) => (
        <button
          key={province.id}
          onClick={() => selectProvince(province.id.toString())}
          className={`text-coolgray font-semibold py-2 px-4 rounded-xl
      ${provinceIds.includes(province.id.toString()) && "bg-whitesmoke"}`}
        >
          {province.name.slice(0, 2)}
        </button>
      ))}
    </div>
  );
};

export default MobileProvinceFilter;
