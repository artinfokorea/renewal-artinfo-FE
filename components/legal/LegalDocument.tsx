import React from "react"

export type LegalSection = { title: string; body: (string | string[])[] }

type Props = {
  title: string
  effectiveDate: string
  intro?: string
  sections: LegalSection[]
}

/** 이용약관·개인정보처리방침 공통 레이아웃 — 앱(아트인포 iOS)과 웹이 같은 문서를 본다 */
const LegalDocument = ({ title, effectiveDate, intro, sections }: Props) => (
  <article className="mx-auto max-w-screen-md px-4 py-8 text-[15px] leading-7 text-gray-800">
    <h1 className="mb-2 text-2xl font-bold text-black">{title}</h1>
    <p className="mb-8 text-sm text-gray-500">시행일 {effectiveDate}</p>
    {intro ? <p className="mb-8">{intro}</p> : null}
    {sections.map((section, index) => (
      <section key={section.title} className="mb-8">
        <h2 className="mb-3 text-lg font-bold text-black">
          제{index + 1}조 ({section.title})
        </h2>
        {section.body.map((paragraph, i) =>
          Array.isArray(paragraph) ? (
            <ol key={i} className="mb-2 list-decimal space-y-1 pl-6">
              {paragraph.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          ) : (
            <p key={i} className="mb-2">
              {paragraph}
            </p>
          ),
        )}
      </section>
    ))}
  </article>
)

export default LegalDocument
