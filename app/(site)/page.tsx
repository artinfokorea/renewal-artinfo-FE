import BannerContainer from "@/components/banner/BannerContainer";
import ConcertContainer from "@/components/concert/MainConcertContainer";
import MainObriContainer from "@/components/obri/MainObriContainer";
import MainRecruitContainer from "@/components/recruits/MainRecruitContainer";

export const Home = async () => {
  return (
    <div className="max-w-screen-lg mx-auto h-full px-2">
      <BannerContainer />
      <ConcertContainer />
      <MainRecruitContainer />
      <article className="bg-whitesmoke h-[100px] md:h-[120px] rounded-xl">
        <div className="max-w-screen-sm mx-auto  relative flex justify-center md:justify-end items-center h-full">
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
      <MainObriContainer />
    </div>
  );
};

export default Home;
