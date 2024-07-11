"use client"

import Image, { ImageProps } from "next/image"
import React, { useState } from "react"

interface Props extends Omit<ImageProps, "src"> {
  src: string
  fallbackText?: string
  fallbackSrc?: string
}

const FallbackImage = ({
  src,
  alt,
  width,
  height,
  fallbackText,
  fallbackSrc = "/img/placeholder-user.png",
  ...props
}: Props) => {
  const [imgError, setImgError] = useState(false)

  const handleError = () => {
    setImgError(true)
  }

  if (imgError) {
    if (fallbackText) {
      return (
        <div className="flex h-full items-center justify-center">
          <span className="font-serif text-base font-bold text-black md:text-xl">
            {fallbackText}
          </span>
        </div>
      )
    }
    return (
      <Image
        src={fallbackSrc}
        alt={alt}
        width={width}
        height={height}
        {...props}
      />
    )
  }

  return (
    <Image
      key={src}
      src={src || fallbackSrc}
      alt={alt}
      width={width}
      height={height}
      onError={handleError}
      {...props}
    />
  )
}

export default FallbackImage
