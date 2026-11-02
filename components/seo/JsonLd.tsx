import { JsonLdObject } from "@/lib/jsonld"

interface Props {
  data: JsonLdObject | JsonLdObject[]
}

/** schema.org JSON-LD 스크립트. 서버 컴포넌트에서 사용한다. */
const JsonLd = ({ data }: Props) => {
  const items = Array.isArray(data) ? data : [data]
  return (
    <>
      {items.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          // "</script>" 주입 방지를 위해 "<"를 이스케이프한다.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  )
}

export default JsonLd
