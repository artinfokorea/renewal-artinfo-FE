import { ArtField, ProfessionalFieldTypes } from "@/types/majors"

interface Props {
  artFields?: ArtField[]
  handleProfessional: (professional: ProfessionalFieldTypes | "") => void
}

const MobileProfessionalFilter = ({ artFields, handleProfessional }: Props) => {
  return (
    <div className="flex flex-col gap-1 px-2 py-4">
      <button
        onClick={() => handleProfessional("")}
        className="rounded-lg px-4 py-1 text-left font-semibold text-coolgray"
      >
        전체
      </button>
      {artFields?.map(({ nameEn, nameKo }) => {
        return (
          <div key={nameEn}>
            <div className="flex items-center">
              <button
                className="flex w-full items-center gap-2 rounded-lg px-4 py-1 text-left font-semibold text-coolgray"
                onClick={() => handleProfessional(nameEn)}
              >
                {nameKo}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default MobileProfessionalFilter
