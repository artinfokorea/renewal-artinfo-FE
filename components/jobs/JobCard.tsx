import { JOB } from "@/types/jobs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Image from "next/image";

interface Props {
  job: JOB;
}

const JobCard = ({ job }: Props) => {
  const pathname = usePathname();
  return (
    <Link href={`${pathname}/${job.id}`}>
      <div className="hover:bg-whitesmoke rounded-xl py-6 px-4">
        <div className="flex">
          <div className="relative h-[140px] w-[230px] border-whitesmoke border-2 rounded-xl">
            <Image
              src={job.imageUrl}
              alt="job_imgge"
              fill
              className="rounded-xl"
              quality={100}
              sizes="(max-width: 768px) 100px 180px, (max-width: 1200px) 200px, 200px"
            />
          </div>

          <div className="ml-12 py-4">
            <h4 className="text-2xl font-bold break-keep">{job.title}</h4>
            <div></div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
