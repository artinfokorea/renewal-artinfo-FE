import { ArtField, ProfessionalFieldTypes } from "@/types/majors"

interface Props {
  artFields?: ArtField[]
  handleProfessional: (professional: ProfessionalFieldTypes | "") => void
}

const MobileProfessionalFilter = ({ artFields, handleProfessional }: Props) => {
  return (
    <div className="py-4 px-2 flex flex-col gap-1">
      <button
        onClick={() => handleProfessional("")}
        className="text-coolgray font-semibold py-1 px-4 text-left rounded-lg"
      >
        전체
      </button>
      {artFields?.map(({ nameEn, nameKo }) => {
        return (
          <div key={nameEn}>
            <div className="flex items-center">
              <button
                className="flex items-center gap-2 text-coolgray font-semibold py-1 px-4 text-left rounded-lg w-full"
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
