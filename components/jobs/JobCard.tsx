import { JOB } from "@/types/jobs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Image from "next/image";
import filters from "@/lib/filters";
import { Badge } from "../ui/badge";

interface Props {
  job: JOB;
}

const JobCard = ({ job }: Props) => {
  const pathname = usePathname();
  const filter = filters();

  return (
    <Link href={`${pathname}/${job.id}`}>
      <div className="hover:bg-whitesmoke rounded-xl h-[130px] md:h-[192px]  flex items-center">
        <div className="flex items-center md:px-4">
          {job.imageUrl && (
            <div className="relative h-[100px] md:h-[140px] w-[120px] md:w-[230px] border-whitesmoke border-2 rounded-xl">
              <Image
                src={job.imageUrl}
                alt="job_imgge"
                fill
                className="rounded-xl"
                quality={100}
                priority
                sizes="(max-width: 768px) 100px 180px, (max-width: 1200px) 200px, 200px"
              />
            </div>
          )}

          <div className="ml-4 md:ml-12 py-2 flex-1">
            <h4 className="text-base md:text-xl font-bold break-keep">
              {job.title}
            </h4>
            <div className="flex my-2 items-center text-xs md:text-sm">
              <span className="mr-2">{job.province as string}</span>
              {job.majors?.map((major) => (
                <Badge
                  key={major}
                  className="text-main text-xs md:text-sm bg-aliceblue rounded-xl mx-1"
                >
                  {major}
                </Badge>
              ))}
            </div>
            <div className="flex justify-between text-coolgray text-sm md:text-base">
              <span>{job.companyName}</span>
              <span>{filter.YYYYMMDD(job.endAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
