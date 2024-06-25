import React, { FormEvent, useState } from "react";
import { Input } from "../ui/input";
import SearchIcon from "../icons/SearchIcon";
import CloseIcon from "../icons/CloseIcon";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  totalCount?: number;
  title?: string;
}

const ListSearchForm = ({ totalCount, title }: Props) => {
  const [searchInput, setSearchInput] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const searchParams = new URLSearchParams(window.location.search);

    searchParams.delete("keyword");
    searchInput && searchParams.append("keyword", searchInput);

    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;

    router.push(newUrl);
  };

  return (
    <div className="max-w-screen-sm mx-auto mt-8 md:mt-20 flex flex-col items-center">
      <h4 className="font-bold text-lg md:text-2xl">
        <span className="text-main">{totalCount ?? "00"}</span>
        {title}
      </h4>
      <form className="w-full mt-4 relative" onSubmit={handleSubmit}>
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full md:text-lg text-black border-gray-400 border placeholder-gray-400 rounded-3xl px-14 md:py-6"
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
