import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "회원가입-ARTINFO",
  description:
    "음악의 중심 아트인포! 클래식 채용, 레슨 등 모든 음악 정보를 아트인포에서 찾아보세요",
};

const page = () => {
  return <main className="h-full">sign-up</main>;
};

export default page;
