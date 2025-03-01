"use client"

import "swiper/css"

import { PostPreview } from "./PostPreview"

const CommunicationContainer = () => {
  return (
    <section className="gird-cols-1 my-12 grid gap-8 md:my-16 md:grid-cols-2 md:gap-12">
      <PostPreview />
    </section>
  )
}

export default CommunicationContainer
