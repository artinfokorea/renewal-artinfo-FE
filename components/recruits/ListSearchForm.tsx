import React, { FormEvent, useState } from "react";
import { Input } from "../ui/input";
import SearchIcon from "../icons/SearchIcon";
import CloseIcon from "../icons/CloseIcon";
import { usePathname, useRouter } from "next/navigation";

const ListSearchForm = () => {
  const [searchInput, setSearchInput] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`${pathname}?keyword=${searchInput}`);
  };

  return (
    <div className="max-w-screen-sm mx-auto mt-8 md:mt-20 flex flex-col items-center">
      <h4 className="font-bold text-lg md:text-2xl">
        <span className="text-main">000</span>개의 채용이 진행중이에요.
      </h4>
      <form className="w-full mt-4 relative" onSubmit={handleSubmit}>
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full md:text-lg text-gray-400 border-gray-400 border placeholder-gray-400 focus:border-2 focus:border-main rounded-3xl px-14 md:py-6"
          placeholder="직군, 전공, 분야 등을 검색해보세요."
        />
        <button type="submit">
          <SearchIcon className="w-5 h-5 md:w-6 md:h-6 absolute left-5 top-[11px] md:top-[14px] text-gray-400" />
        </button>

        {searchInput && (
          <button
            type="button"
            onClick={() => setSearchInput("")}
            className="absolute right-3 top-[10px] md:top-[14px]"
          >
            <CloseIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
          </button>
        )}
      </form>
    </div>
  );
};

export default ListSearchForm;