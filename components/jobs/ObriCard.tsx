import filters from "@/lib/filters";
import { JOB } from "@/types/jobs";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { EditIcon } from "lucide-react";
import TrashIcon from "../icons/TrashIcon";

interface Props {
  job: JOB;
}

const ObriCard = ({ job }: Props) => {
  const filter = filters();
  const pathname = usePathname();
  return (
    <Link href={`${pathname}/${job.id}`}>
      <ul className="flex flex-col border-whitesmoke border my-4 md:my-6 md:mx-4 rounded-lg">
        <li className="flex justify-between items-center h-12 md:h-12 border-whitespace border-b px-4">
          <h4 className="font-bold text-sm md:text-base">{job.title}</h4>
          <div className="text-xs md:text-sm flex gap-4 items-center">
            <span>{job.majors[0]}</span>
            {job.endAt < new Date() ? (
              <button disabled className="text-white bg-lightgray px-3 rounded">
                마감
              </button>
            ) : (
              <button className="text-main border-whitesmoke border px-3 rounded">
                지원
              </button>
            )}
          </div>
        </li>
        <li className="grid grid-cols-5 text-xs md:text-sm items-center h-12 md:h-12 border-whitespace border-b px-4">
          <span className="font-bold col-span-2">페이 {job.fee}만원</span>
          <span className="col-span-3">{job.province}</span>
        </li>
        <li className="h-12 md:h-12 border-whitespace border-b px-4 flex justify-center items-center text-xs md:text-sm gap-4 md:gap-8">
          <span>{filter.YYYYMMDD(job.startAt, "YYYY.MM.DD(ddd) hh:mm")}</span> -
          <span>{filter.YYYYMMDD(job.endAt, "YYYY.MM.DD(ddd) hh:mm")}</span>
        </li>
        <li className="h-12 md:h-12 px-6 flex items-center text-xs md:text-sm">
          <span className="w-[6px] h-[6px] bg-primary rounded-full mr-2 " />
          {job.contents}
        </li>
      </ul>
    </Link>
  );
};

export default ObriCard;

// <ul className="flex flex-col border-whitesmoke border my-4 md:my-6 md:mx-4">
// <li
//   className="h-16 px-4 grid grid-cols-5 border-b-whitesmoke border-b-2
// items-center
// "
// >
//   <span className="text-sm md:text-lg">{job.majors[0]}</span>
//   <span className="col-span-3 font-bold text-sm md:text-lg">
//     {job.title}
//   </span>
//   <div className="flex justify-end items-center">
//     {/* <button className="mx-1 border-whitesmoke border p-1">
//       <EditIcon className="w-5 h-5" />
//     </button>
//     <button className="mx-1 border-whitesmoke border p-1">
//       <TrashIcon className="w-5 h-5" />
//     </button> */}
//     {job.endAt < new Date() ? (
//       <button disabled className="text-white bg-lightgray px-3 rounded">
//         마감
//       </button>
//     ) : (
//       <button className="text-main border-whitesmoke border px-3 rounded">
//         지원
//       </button>
//     )}
//   </div>
// </li>
// <li className="h-16 border-b-whitesmoke border-b-2 grid grid-cols-6 items-center px-4">
//   <span className="font-bold text-sm md:text-base">
//     페이 {job.fee} 만원
//   </span>
//   <span className="col-span-3 text-sm md:text-base">
//     {job.province}
//   </span>
//   <span className="col-span-2 text-xs md:text-sm text-primary md:leading-6 text-right">
//     {filter.YYYYMMDD(job.startAt, "YYYY.MM.DD(ddd) hh:mm")}
//     <br />
//     {filter.YYYYMMDD(job.endAt, "YYYY.MM.DD(ddd) hh:mm")}
//   </span>
// </li>
// {job.contents.length > 1 && (
//   <li className="h-16 flex items-center px-8 text-primary text-sm md:text-base">
//     <span className="w-[6px] h-[6px] bg-primary rounded-full mr-2 " />
//     {job.contents}
//   </li>
// )}
// </ul>
