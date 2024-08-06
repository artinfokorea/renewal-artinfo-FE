import React from "react"
import EventCard from "./EventCard"

const EventList = () => {
  return (
    <div className="mt-4 grid grid-cols-2 gap-4 px-4 md:grid-cols-3 md:gap-8">
      {Array.from({ length: 6 }).map((_, index) => (
        <EventCard key={index} isLastPage={!(index === 5)} />
      ))}
    </div>
  )
}

export default EventList
