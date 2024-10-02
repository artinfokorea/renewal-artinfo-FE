import { Metadata } from "next"
import Script from "next/script"

export const metadata: Metadata = {
  title: "로그인-ARTINFO",
  description:
    "예술의 중심 아트인포! 예술 채용, 레슨 등 모든 예술 정보를 아트인포에서 찾아보세요",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* <script
        src="https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js"
        defer
      /> */}
      <script src="https://developers.kakao.com/sdk/js/kakao.js" defer />
      <script
        src="https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js"
        defer
      />
      <main>{children}</main>
    </>
  )
}
