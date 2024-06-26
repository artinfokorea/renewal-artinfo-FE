import Image, { ImageProps } from "next/image";
import React, { useState } from "react";

interface Props extends Omit<ImageProps, "src"> {
  src: string;
  fallbackText?: string;
}

const FallbackImage = ({ src, alt, fallbackText, ...props }: Props) => {
  const [isError, setIsError] = useState(false);

  const handleError = () => {
    setIsError(!isError);
  };

  return (
    <>
      {isError ? (
        <div className="flex items-center justify-center h-full">
          <span className="font-bold text-black text-base md:text-xl font-serif">
            {fallbackText}
          </span>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          onError={handleError}
          quality={100}
          {...props}
        />
      )}
    </>
  );
};

export default FallbackImage;
