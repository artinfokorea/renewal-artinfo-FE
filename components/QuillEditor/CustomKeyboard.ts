import Quill from "quill"

const KeyboardModule = Quill.import("modules/keyboard")

interface BindingContext {
  format: { [key: string]: any }
  offset: number
}

interface KeyboardEventLike {
  key: string
  shiftKey: boolean
  [key: string]: any // 다른 가능한 속성들을 위해
}

export class CustomKeyboard extends KeyboardModule {
  addBinding(
    key: KeyboardEventLike,
    context: BindingContext,
  ): { insert: string } | undefined {
    if (key.key === "Enter" && key.shiftKey) {
      return {
        insert: "\n",
      }
    }
    return super.addBinding(key, context)
  }
}

Quill.register("modules/keyboard", CustomKeyboard, true)
