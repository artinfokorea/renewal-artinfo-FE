import React from "react"

export const LessonBanner = () => {
  return (
    <>
      <article className="my-12 hidden h-[100px] rounded-xl bg-whitesmoke md:my-16 md:flex md:h-[120px]">
        <div className="relative mx-auto flex h-full max-w-screen-md items-center justify-center">
          <img
            src="/img/instruments.png"
            alt="instruments_image"
            className="absolute bottom-2 left-0 hidden h-40 w-40 md:block"
          />
          <div className="flex justify-between md:ml-40">
            <h4 className="mx-4 text-base font-bold md:mx-24 md:text-lg">
              많은 학생들이 레슨 받으려고 <br />
              기다리고 있어요.
            </h4>
            <a href="/lessons/create">
              <button className="rounded-xl bg-white px-6 py-3 text-sm font-semibold tracking-widest text-main md:px-8 md:py-[18px] md:text-base">
                레슨 등록하기
              </button>
            </a>
          </div>
        </div>
      </article>
      <article className="flex h-[100px] rounded-xl bg-whitesmoke md:hidden md:h-[120px]">
        <div className="flex w-full items-center justify-between px-6 py-4">
          <div className="flex flex-col gap-2 text-sm">
            <h4 className="font-medium">
              많은 학생들이 레슨 받으려고 <br />
              기다리고 있어요.
            </h4>
            <a href="/lessons/create" className="font-bold text-main">
              레슨 등록하기
            </a>
          </div>
          <img
            src="/img/instruments.png"
            alt="instruments_image"
            className="h-32 w-32"
          />
        </div>
      </article>
    </>
  )
}
