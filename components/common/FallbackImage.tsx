"use client"

import Image, { ImageProps } from "next/image"
import React, { useState } from "react"

interface FallbackImageProps extends Omit<ImageProps, "src"> {
  src?: string
  fallbackText?: string
  fallbackSrc?: string
}

const blurDataUrl =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJoAAAB2CAYAAAAweYruAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAE1SURBVHgB7dIxAQAgEAAhtX/Yb6ApvAkysGfmLvjsLAiIRkI0EqKREI2EaCREIyEaCdFIiEZCNBKikRCNhGgkRCMhGgnRSIhGQjQSopEQjYRoJEQjIRoJ0UiIRkI0EqKREI2EaCREIyEaCdFIiEZCNBKikRCNhGgkRCMhGgnRSIhGQjQSopEQjYRoJEQjIRoJ0UiIRkI0EqKREI2EaCREIyEaCdFIiEZCNBKikRCNhGgkRCMhGgnRSIhGQjQSopEQjYRoJEQjIRoJ0UiIRkI0EqKREI2EaCREIyEaCdFIiEZCNBKikRCNhGgkRCMhGgnRSIhGQjQSopEQjYRoJEQjIRoJ0UiIRkI0EqKREI2EaCREIyEaCdFIiEZCNBKikRCNhGgkRCMhGgnRSIhGQjQSopEQjcQDmXkEu5jIEjMAAAAASUVORK5CYII="

const FallbackImage = ({
  src,
  alt,
  width,
  height,
  fallbackText,
  fallbackSrc = "/img/placeholder-user.png",
  ...props
}: FallbackImageProps) => {
  const [imgError, setImgError] = useState(false)

  const handleError = () => setImgError(true)

  if (!src && fallbackText) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="font-serif text-base font-bold text-black md:text-xl">
          {fallbackText}
        </span>
      </div>
    )
  }

  const imageSrc = imgError || !src ? fallbackSrc : src

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      onError={!imgError ? handleError : undefined}
      placeholder="blur"
      blurDataURL={blurDataUrl}
      {...props}
    />
  )
}

export default FallbackImage
