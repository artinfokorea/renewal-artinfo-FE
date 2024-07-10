"use client"

import React, { useMemo, useCallback } from "react"
import "react-quill/dist/quill.snow.css"
import ReactQuill from "react-quill"
import { uploadImages } from "@/apis/system"
import { UploadTarget } from "@/types"
import "./editor.css"

const QuillEditor = ({ quillRef, htmlContent, handleContent }: any) => {
  const imageHandler = useCallback(() => {
    const input = document.createElement("input")
    input.setAttribute("type", "file")
    input.setAttribute("accept", "image/*")
    input.setAttribute("name", "image")
    input.click()

    input.onchange = async () => {
      if (!input.files || input.files.length === 0) return
      const file = input.files[0]

      const uploadResponse = await uploadImages(UploadTarget.JOB, [file], false)

      const url = uploadResponse.images[0].url
      const quill = quillRef.current.getEditor()

      const range = quill.getSelection()?.index

      if (typeof range !== "number") return

      quill.setSelection(range, 1)

      console.log("img", `<img src=${url} alt="image" />`)

      quill.clipboard.dangerouslyPasteHTML(
        range,
        `<img src=${url} alt="image" />`,
      )
    }
  }, [quillRef])

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ size: ["small", false, "large", "huge"] }, { color: [] }],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
            { align: [] },
          ],
          ["image", "video"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    [imageHandler],
  )

  return (
    <ReactQuill
      ref={quillRef}
      value={htmlContent}
      onChange={e => handleContent(e)}
      modules={modules}
      theme="snow"
      style={{ height: "100%" }}
    />
  )
}

export default QuillEditor