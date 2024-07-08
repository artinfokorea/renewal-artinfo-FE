import Quill from "quill"

const Clipboard = Quill.import("modules/clipboard")
const Delta = Quill.import("delta")

interface ClipboardEvent extends Event {
  clipboardData: DataTransfer
}

interface QuillRange {
  index: number
  length: number
}

class CustomClipboard extends Clipboard {
  onPaste(e: ClipboardEvent) {
    e.preventDefault()
    const text = e.clipboardData.getData("text/plain")
    const delta = new Delta().insert(text.replace(/\n/g, "<br>"))
    const range = this.quill.getSelection()
    this.quill.updateContents(delta, "user")
    this.quill.setSelection(range.index + text.length, "silent")
  }
}

Quill.register("modules/clipboard", CustomClipboard, true)
