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
    if (!html) {
      console.log("HTML is null or undefined, returning empty string")
      return ""
    }

    try {
      console.log("Initial HTML:", html)

      // 스타일 속성과 font-family 속성 제거
      const preprocessedHtml = html.replace(/<[^>]+>/g, match => {
        // 각 태그에서 style 속성 제거
        let cleanedMatch = match.replace(/ style=["'][^"']*["']/gi, "")

        // font-family 속성 제거
        cleanedMatch = cleanedMatch.replace(
          /font-family\s*:\s*(?:&quot;|')[^;&]*(?:&quot;|')?;?/gi,
          "",
        )

        return cleanedMatch
      })

      console.log(
        "After removing style and font-family attributes:",
        preprocessedHtml,
      )

      // DOMPurify로 HTML 정제
      const sanitized = DOMPurify.sanitize(preprocessedHtml, {
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
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "table",
          "thead",
          "tbody",
          "tr",
          "th",
          "td",
        ],
        ALLOWED_ATTR: [
          "href",
          "target",
          "rel",
          "src",
          "alt",
          "colspan",
          "rowspan",
        ],
        ALLOW_DATA_ATTR: false,
        FORBID_TAGS: ["script", "iframe", "style"],
        FORBID_ATTR: ["style", "class"],
        ALLOW_UNKNOWN_PROTOCOLS: true,
      })

      console.log("Sanitized HTML:", sanitized)
      return sanitized
    } catch (error) {
      console.error("Sanitization error:", error)
      return ""
    }
  }

  return (
    <Editor
      ref={editorRef}
      placeholder="내용을 입력해주세요."
      initialEditType="wysiwyg"
      initialValue=""
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
