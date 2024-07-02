import { PROVINCE } from "@/types"

interface Props {
  provinces?: PROVINCE[]
  handleProvince: (provinceId: string | "") => void
}

const MobileProvinceFilter = ({ provinces, handleProvince }: Props) => {
  return (
    <div className="py-4 px-2 grid grid-cols-5 gap-1">
      <button
        onClick={() => handleProvince("")}
        className="text-coolgray font-semibold py-2 px-4 rounded-xl"
      >
        전체
      </button>
      {provinces?.map(province => (
        <button
          key={province.id}
          onClick={() => handleProvince(province.id.toString())}
          className="text-coolgray font-semibold py-2 px-4 rounded-xl"
        >
          {province.name.slice(0, 2)}
        </button>
      ))}
    </div>
  )
}

export default MobileProvinceFilter
