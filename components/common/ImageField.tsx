import React from "react"
import Image, { ImageProps } from "next/image"
import { Button } from "../ui/button"
import CloseIcon from "../icons/CloseIcon"
import { Spinner } from "./Loading"
import PhotoIcon from "../icons/PhotoIcon"

interface Props extends Omit<ImageProps, "src"> {
  imageUrl?: string
  deleteImage: () => void
  alt: string
  isImageLoading: boolean
  openFileUploader: () => void
  className?: string
  /** 빈 상태 제목 (기본: 대표 이미지를 등록해주세요.) */
  title?: string
  /** 빈 상태 보조 설명 — 선택 항목임을 알릴 때 쓴다 */
  description?: string
}

const ImageField = ({
  imageUrl,
  isImageLoading,
  alt,
  deleteImage,
  openFileUploader,
  className,
  title = "대표 이미지를 등록해주세요.",
  description,
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
            <h5 className="text-sm font-bold md:text-base">{title}</h5>
            {description ? (
              <p className="px-4 text-center text-xs text-silver md:text-sm">
                {description}
              </p>
            ) : null}
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
