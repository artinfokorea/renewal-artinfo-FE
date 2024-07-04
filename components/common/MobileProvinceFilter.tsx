import { PROVINCE } from "@/types"

interface Props {
  provinces?: PROVINCE[]
  handleProvince: (provinceId: string | "") => void
}

const MobileProvinceFilter = ({ provinces, handleProvince }: Props) => {
  return (
    <div className="grid grid-cols-5 gap-1 px-2 py-4">
      <button
        onClick={() => handleProvince("")}
        className="rounded-xl px-4 py-2 font-semibold text-coolgray"
      >
        전체
      </button>
      {provinces?.map(province => (
        <button
          key={province.id}
          onClick={() => handleProvince(province.id.toString())}
          className="rounded-xl px-4 py-2 font-semibold text-coolgray"
        >
          {province.name.slice(0, 2)}
        </button>
      ))}
    </div>
  )
}

export default MobileProvinceFilter
