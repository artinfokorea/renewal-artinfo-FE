"use client"

import { useState, useCallback } from "react"
import imageCompression from "browser-image-compression"
import { useLoading } from "@toss/use-loading"
import { uploadImages } from "@/apis/system"

interface CompressOptions {
  maxSizeMB: number
  maxWidthOrHeight: number
  useWebWorker: boolean
}

const defaultOptions: CompressOptions = {
  maxSizeMB: 30,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
}

const useImageCompress = () => {
  const [isUploadLoading, startTransition] = useLoading()
  const [uploadError, setUploadError] = useState<Error | null>(null)

  const compressAndUpload = useCallback(
    async (files: File[], options: CompressOptions = defaultOptions) => {
      setUploadError(null)

      try {
        const compressPromises = files.map(file =>
          imageCompression(file, options),
        )

        const compressedFiles = await startTransition(
          Promise.all(compressPromises),
        )

        const uploadResponse = await startTransition(
          uploadImages(compressedFiles),
        )

        return uploadResponse
      } catch (err) {
        console.error("이미지 압축 또는 업로드 실패:", err)
        setUploadError(
          err instanceof Error ? err : new Error("Unknown error occurred"),
        )
        throw err
      }
    },
    [startTransition],
  )

  return {
    compressAndUpload,
    isUploadLoading,
    uploadError,
  }
}

export default useImageCompress
