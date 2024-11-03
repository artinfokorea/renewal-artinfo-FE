import React from "react"

interface ActivitiesTypeTabProps {
  tab: "posted" | "applied"
  handleTab: (tab: "posted" | "applied") => void
}

const TabItem = ({
  tab,
  isActive,
  title,
  handleTab,
}: {
  tab: "posted" | "applied"
  isActive: boolean
  handleTab: (tab: "posted" | "applied") => void
  title: string
}) => {
  return (
    <button
      onClick={() => handleTab(tab)}
      className={`rounded py-2 ${isActive && "bg-main text-white"}`}
    >
      {title}
    </button>
  )
}

export const ActivitiesTypeTab = ({
  tab,
  handleTab,
}: ActivitiesTypeTabProps) => {
  return (
    <div className="mx-4 mb-2 flex flex-col border">
      <div className="grid grid-cols-2 text-sm text-main">
        <TabItem
          tab={tab}
          isActive={tab === "posted"}
          handleTab={() => handleTab("posted")}
          title="내 연주"
        />
        <TabItem
          tab={tab}
          isActive={tab === "applied"}
          handleTab={() => handleTab("applied")}
          title="참여 연주"
        />
      </div>
    </div>
  )
}
