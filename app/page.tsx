import BannerContainer from "@/components/banner/BannerContainer";

export const Home = async () => {
  return (
    <main className="max-w-screen-lg mx-auto h-full">
      <BannerContainer />

      <div className="bg-whitesmoke h-[120px] rounded-xl">
        <div className="max-w-screen-sm mx-auto  relative flex justify-end items-center h-full">
          <img
            src="/img/instruments.png"
            alt="instruments_image"
            className="w-40 h-40 absolute bottom-2 left-0"
          />
          <div className="flex justify-between ">
            <h4 className="font-bold text-lg mx-16">
              많은 학생들이 레슨 받으려고 <br />
              기다리고 있어요.
            </h4>
            <a href="/lessons/create">
              <button className="px-8 py-[18px] rounded-xl bg-white text-main font-semibold tracking-widest">
                레슨 등록하기
              </button>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
