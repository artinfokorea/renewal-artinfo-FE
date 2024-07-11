import { CKEditor } from "@ckeditor/ckeditor5-react"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import "@ckeditor/ckeditor5-build-classic/build/translations/ko"
import "ckeditor5/ckeditor5.css"
import { uploadImages } from "@/apis/system"
import { UploadTarget } from "@/types"

interface Props {
  value: string
  onChange: (value: string) => void
}

const CEditor = ({ value, onChange }: Props) => {
  function MyCustomUploadAdapterPlugin(editor: any) {
    editor.plugins.get("FileRepository").createUploadAdapter = (
      loader: any,
    ) => {
      return {
        upload: () => {
          return new Promise((resolve, reject) => {
            loader.file.then(async (file: File) => {
              try {
                const response = await uploadImages(UploadTarget.JOB, [file])
                const uploadedImageUrl = response.images[0].url
                resolve({ default: uploadedImageUrl })
              } catch (error) {
                reject(error)
              }
            })
          })
        },
      }
    }
  }

  const editorConfiguration = {
    toolbar: [
      "heading",
      "|",
      "bold",
      "italic",
      "link",
      "bulletedList",
      "numberedList",
      "|",
      "imageUpload",
      "blockQuote",
    ],
    language: "ko",
    extraPlugins: [MyCustomUploadAdapterPlugin],
  }

  return (
    <CKEditor
      editor={ClassicEditor}
      data={value}
      config={editorConfiguration}
      onReady={editor => {
        editor.editing.view.change(writer => {
          writer.setStyle(
            "height",
            "500px",
            editor.editing.view.document.getRoot()!,
          )
        })
      }}
      onChange={(event, editor) => {
        const data = editor.getData()
        onChange(data)
      }}
    />
  )
}

export default CEditor
