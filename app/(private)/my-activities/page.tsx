"use client"

import { ActivitiesTypeTab } from "@/components/activities/ActivitiesTypeTab"
import JoinedList from "@/components/activities/JoinedList"
import { PostedList } from "@/components/activities/PostedList"

import React, { useState } from "react"

const page = () => {
  const [tab, setTab] = useState<"posted" | "applied">("posted")

  const handleTab = (tab: "posted" | "applied") => setTab(tab)

  return (
    <>
      <div className="my-8">
        <ActivitiesTypeTab tab={tab} handleTab={handleTab} />
        {tab === "posted" && <PostedList />}
        {tab === "applied" && <JoinedList />}
      </div>
    </>
  )
}

export default page
