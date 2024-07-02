import React from "react"
import Image from "next/image"
import { Button } from "../ui/button"
import CloseIcon from "../icons/CloseIcon"
import Loading from "./Loading"
import PhotoIcon from "../icons/PhotoIcon"

interface Props {
  imageUrl?: string
  deleteImage: () => void
  alt: string
  isImageLoading: boolean
  openFileUploader: () => void
  className?: string
}

const ImageField = ({
  imageUrl,
  isImageLoading,
  alt,
  deleteImage,
  openFileUploader,
  className,
}: Props) => {
  return (
    <>
      {imageUrl ? (
        <div className={`rounded-md relative ${className}`}>
          <Image
            src={imageUrl || ""}
            alt={alt}
            fill
            quality={100}
            sizes="(max-width: 768px) 100px 190px, 198px 240px"
          />
          <Button
            className="absolute top-2 right-2 rounded-full opacity-40 bg-white p-2"
            onClick={deleteImage}
          >
            <CloseIcon className="w-6 h-6 text-primary" />
          </Button>
        </div>
      ) : isImageLoading ? (
        <div className={`flex justify-center items-center ${className}`}>
          <Loading className="w-10 h-10" />
        </div>
      ) : (
        <div
          className={`bg-whitesmoke rounded-md flex flex-col items-center justify-center gap-6 ${className}`}
        >
          <div className="flex flex-col items-center gap-2">
            <PhotoIcon className="w-12 h-12 text-dimgray" />
            <h5 className="font-bold text-sm md:text-base">
              대표 이미지를 등록해주세요.
            </h5>
          </div>
          <Button
            type="button"
            className="bg-white text-silver font-medium h-8 px-6"
            onClick={openFileUploader}
          >
            이미지 선택
          </Button>
        </div>
      )}
    </>
  )
}

export default ImageField