import React from "react"
import Image from "next/image"
import { Button } from "../ui/button"
import CloseIcon from "../icons/CloseIcon"
import { Spinner } from "./Loading"
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
        <div className={`relative rounded-md ${className}`}>
          <Image
            src={imageUrl || ""}
            alt={alt}
            fill
            quality={100}
            sizes="(max-width: 768px) 100px 190px, 198px 240px"
          />
          <Button
            className="absolute right-2 top-2 rounded-full bg-white p-2 opacity-40"
            onClick={deleteImage}
          >
            <CloseIcon className="h-6 w-6 text-primary" />
          </Button>
        </div>
      ) : isImageLoading ? (
        <div className={`flex items-center justify-center ${className}`}>
          <Spinner className="h-10 w-10" />
        </div>
      ) : (
        <div
          className={`flex flex-col items-center justify-center gap-6 rounded-md bg-whitesmoke ${className}`}
        >
          <div className="flex flex-col items-center gap-2">
            <PhotoIcon className="h-12 w-12 text-dimgray" />
            <h5 className="text-sm font-bold md:text-base">
              대표 이미지를 등록해주세요.
            </h5>
          </div>
          <Button
            type="button"
            className="h-8 bg-white px-6 font-medium text-silver"
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
