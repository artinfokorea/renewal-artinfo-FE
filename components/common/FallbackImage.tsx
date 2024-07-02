"use client"

import Image, { ImageProps } from "next/image"
import React, { useEffect, useState } from "react"

interface Props extends Omit<ImageProps, "src"> {
  src: string
  fallbackText?: string
  fallbackSrc?: string
}

const FallbackImage = ({
  src = "",
  alt,
  width,
  height,
  fallbackText,
  ...props
}: Props) => {
  const defaultSrc = "/img/placeholder-user.png"
  const [imgSrc, setImgSrc] = useState(src || defaultSrc)
  const [imgError, setImgError] = useState(false)

  const handleError = () => {
    if (src) {
      setImgSrc(defaultSrc)
    } else {
      setImgError(true)
    }
  }

  if (imgError) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="font-bold text-black text-base md:text-xl font-serif">
          {fallbackText}
        </span>
      </div>
    )
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      onError={handleError}
      quality={100}
      {...props}
    />
  )
}

export default FallbackImage
