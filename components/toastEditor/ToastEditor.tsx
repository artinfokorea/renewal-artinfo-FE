import React, { useEffect, useRef } from "react"
import { Editor } from "@toast-ui/react-editor"
import "@toast-ui/editor/dist/toastui-editor.css"
import "tui-color-picker/dist/tui-color-picker.css"
import colorSyntax from "@toast-ui/editor-plugin-color-syntax"
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css"
import { uploadImages } from "@/apis/system"
import { UploadTarget } from "@/types"
import useToast from "@/hooks/useToast"
import DOMPurify from "dompurify"

interface Props {
  value: string
  onChange: (value: string) => void
}

const ToastEditor = ({ value, onChange }: Props) => {
  const editorRef = useRef<Editor>(null)
  const { errorToast } = useToast()

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.getInstance().setHTML(value)
    }
  }, [value])

  const handleChange = () => {
    if (onChange && editorRef.current) {
      const instance = editorRef.current.getInstance()
      onChange(instance.getHTML())
    }
  }

  const handleImageUpload = async (
    file: File,
    callback: (url: string, altText: string) => void,
  ) => {
    try {
      const response = await uploadImages(UploadTarget.JOB, [file], false)
      const url = response.images[0].url
      const imageUrl = url
      callback(imageUrl, "Image")
    } catch (error: any) {
      console.error("Error uploading image:", error)
      errorToast(error.response.data.message)
    }
  }

  const customPasteEventHandler = (event: ClipboardEvent) => {
    event.preventDefault()

    let pastedData =
      event.clipboardData?.getData("text/html") ||
      event.clipboardData?.getData("text/plain")

    if (pastedData) {
      const sanitizedContent = DOMPurify.sanitize(pastedData, {
        ALLOWED_TAGS: [
          "p",
          "b",
          "i",
          "em",
          "strong",
          "a",
          "ul",
          "ol",
          "li",
          "br",
        ],
        ALLOWED_ATTR: ["href", "target"],
      })

      const editorInstance = editorRef.current?.getInstance()
      if (editorInstance) {
        editorInstance.setHTML(editorInstance.getHTML() + sanitizedContent)
      }
    }
  }

  useEffect(() => {
    const editorElement = editorRef.current?.getRootElement()
    if (editorElement) {
      editorElement.addEventListener("paste", customPasteEventHandler)
    }

    return () => {
      if (editorElement) {
        editorElement.removeEventListener("paste", customPasteEventHandler)
      }
    }
  }, [])

  return (
    <Editor
      ref={editorRef}
      initialValue=""
      previewStyle="vertical"
      height="600px"
      plugins={[colorSyntax]}
      initialEditType="wysiwyg"
      onChange={handleChange}
      hooks={{
        addImageBlobHook: handleImageUpload,
      }}
      toolbarItems={[
        ["heading", "bold", "italic", "strike"],
        ["hr", "quote"],
        ["ul", "ol"],
        ["image", "link"],
      ]}
      customHTMLSanitizer={(html: string) => {
        return DOMPurify.sanitize(html, {
          ALLOWED_TAGS: [
            "p",
            "b",
            "i",
            "em",
            "strong",
            "a",
            "ul",
            "ol",
            "li",
            "br",
          ],
          ALLOWED_ATTR: ["href", "target"],
        })
      }}
      useCommandShortcut={false}
      hideModeSwitch={true}
      style={{ height: "100%" }}
    />
  )
}

export default ToastEditor
