import { Editor } from "@toast-ui/react-editor"
import React, { useCallback, useEffect, useRef } from "react"
import colorSyntax from "@toast-ui/editor-plugin-color-syntax"
import { UseFormSetValue } from "react-hook-form"
import "@toast-ui/editor/dist/toastui-editor.css"
import "./toastEditor.css"
import { uploadImages } from "@/apis/system"

interface Props {
  value?: string
  setValue: UseFormSetValue<any>
}

const ToastEditor = ({ setValue, value = "" }: Props) => {
  const editorRef = useRef<Editor>(null)
  const toolbarItems = [
    ["heading", "bold", "italic", "strike"],
    ["hr"],
    ["ul", "ol", "task"],
    ["link"],
    ["image"],
  ]

  const handleChange = useCallback(() => {
    if (editorRef.current) {
      setValue("contents", editorRef.current.getInstance().getHTML())
    }
  }, [])

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.getInstance().removeHook("change")
      editorRef.current.getInstance().addHook("change", handleChange)
    }
  }, [handleChange])

  const onUploadImage = async (blob: Blob, callback: (url: string) => void) => {
    try {
      const file = new File([blob], "image.jpg", { type: blob.type })
      const uploadResponse = await uploadImages([file])

      callback(uploadResponse.images[0].url)
    } catch (error) {
      console.error("Image upload failed:", error)
    }
  }

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.getInstance().setMarkdown(value)
    }
  }, [])
  return (
    <Editor
      ref={editorRef}
      placeholder="내용을 입력해주세요."
      initialValue=""
      initialEditType="wysiwyg"
      height="100%"
      previewStyle="vertical"
      toolbarItems={toolbarItems}
      plugins={[colorSyntax]}
      hideModeSwitch={true}
      hooks={{ addImageBlobHook: onUploadImage }}
    />
  )
}

export default ToastEditor
