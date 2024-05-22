import BannerContainer from "@/components/banner/BannerContainer";

export const Home = async () => {
  return (
    <main className="max-w-screen-xl mx-auto h-full px-2 md:px-0">
      <BannerContainer />

      <article className="bg-whitesmoke h-[100px] md:h-[120px] rounded-xl">
        <div className="max-w-screen-md mx-auto  relative flex justify-center md:justify-end items-center h-full">
          <img
            src="/img/instruments.png"
            alt="instruments_image"
            className="w-40 h-40 bottom-2 left-0 hidden md:block absolute"
          />
          <div className="flex justify-between">
            <h4 className="font-bold text-base md:text-lg mx-4 md:mx-12">
              많은 학생들이 레슨 받으려고 <br />
              기다리고 있어요.
            </h4>
            <a href="/lessons/create">
              <button className="px-6 md:px-8 text-sm md:text-base  py-3 md:py-[18px] rounded-xl bg-white text-main font-semibold tracking-widest">
                레슨 등록하기
              </button>
            </a>
          </div>
        </div>
      </article>
    </main>
  );
};

export default Home;
