import { Editor } from "@toast-ui/react-editor"
import React, { useCallback, useEffect, useRef } from "react"
import colorSyntax from "@toast-ui/editor-plugin-color-syntax"
import { UseFormSetValue } from "react-hook-form"
import "@toast-ui/editor/dist/toastui-editor.css"
import "./toastEditor.css"
import { uploadImages } from "@/apis/system"
import DOMPurify from "dompurify"
import { UploadTarget } from "@/types"

interface Props {
  value?: string
  setValue: UseFormSetValue<any>
}

DOMPurify.addHook("beforeSanitizeAttributes", node => {
  if (node.hasAttribute("style")) {
    const styles = node.getAttribute("style")
    // style 속성 값을 그대로 유지하되, 세미콜론으로 끝나도록 보장
    node.setAttribute("style", styles?.endsWith(";") ? styles : styles + ";")
  }
})

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
      const uploadResponse = await uploadImages(UploadTarget.JOB, [file], false)

      callback(uploadResponse.images[0].url)
    } catch (error) {
      console.error("Image upload failed:", error)
    }
  }

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.getInstance().setHTML(value)
    }
  }, [])

  const customSanitizer = (html: string) => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        "p",
        "br",
        "span",
        "strong",
        "em",
        "u",
        "a",
        "img",
        "ul",
        "ol",
        "li",
      ],
      ALLOWED_ATTR: ["href", "target", "rel", "src", "alt", "style"],
      ADD_TAGS: ["style"],
      ADD_ATTR: ["style"],
      ALLOW_DATA_ATTR: false,
      FORBID_ATTR: ["class", "id"],
      ALLOW_UNKNOWN_PROTOCOLS: true,
      SAFE_FOR_TEMPLATES: true,
      WHOLE_DOCUMENT: false,
    })
  }

  return (
    <Editor
      ref={editorRef}
      placeholder="내용을 입력해주세요."
      initialEditType="wysiwyg"
      height="100%"
      previewStyle="vertical"
      toolbarItems={toolbarItems}
      plugins={[colorSyntax]}
      hideModeSwitch={true}
      hooks={{
        addImageBlobHook: onUploadImage,
      }}
      customHTMLSanitizer={customSanitizer}
    />
  )
}

export default ToastEditor
