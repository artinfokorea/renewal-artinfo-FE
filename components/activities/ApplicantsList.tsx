import { queries } from "@/lib/queries"
import { useQuery } from "@tanstack/react-query"
import React from "react"

interface ApplicantsListProps {
  jobId: number
}

const ApplicantsList = ({ jobId }: ApplicantsListProps) => {
  const { data: applicants } = useQuery(queries.jobs.applicantList(jobId))

  console.log(applicants)

  return <div>ApplicantsList</div>
}

export default ApplicantsList
