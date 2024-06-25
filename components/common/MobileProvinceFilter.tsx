import { PROVINCE } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Props {
  provinces?: PROVINCE[];
}

const MobileProvinceFilter = ({ provinces }: Props) => {
  const searchParams = useSearchParams();
  const provinceIds = searchParams.getAll("provinceId");
  const router = useRouter();
  const [selectedProvinceIds, setSelectedProvinceIds] =
    useState<string[]>(provinceIds);

  const selectProvince = (provinceId: string) => {
    if (selectedProvinceIds.includes(provinceId)) {
      setSelectedProvinceIds(
        selectedProvinceIds.filter((v) => v !== provinceId)
      );
    } else {
      setSelectedProvinceIds([...selectedProvinceIds, provinceId]);
    }
  };

  useEffect(() => {
    const locationParams = new URLSearchParams(window.location.search);
    locationParams.delete("provinceId");
    selectedProvinceIds.forEach((v) => locationParams.append("provinceId", v));
    const newUrl = `${window.location.pathname}?${locationParams.toString()}`;
    router.push(newUrl, {
      scroll: false,
    });
  }, [selectedProvinceIds]);

  return (
    <div className="py-4 px-2 grid grid-cols-5 gap-1">
      {provinces?.map((province) => (
        <button
          key={province.id}
          onClick={() => selectProvince(province.id.toString())}
          className={`text-coolgray font-semibold py-2 px-4 rounded-xl
      ${
        selectedProvinceIds.includes(province.id.toString()) && "bg-whitesmoke"
      }`}
        >
          {province.name.slice(0, 2)}
        </button>
      ))}
    </div>
  );
};

export default MobileProvinceFilter;
