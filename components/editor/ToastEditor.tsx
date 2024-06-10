import { Editor } from "@toast-ui/react-editor";
import React, { useCallback, useEffect, useRef } from "react";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import { UseFormSetValue } from "react-hook-form";
import "@toast-ui/editor/dist/toastui-editor.css";
import "./toastEditor.css";

interface Props {
  setValue: UseFormSetValue<any>;
}

const ToastEditor = ({ setValue }: Props) => {
  const editorRef = useRef<Editor>(null);
  const toolbarItems = [
    ["heading", "bold", "italic", "strike"],
    ["hr"],
    ["ul", "ol", "task"],
    ["link"],
    ["image"],
  ];

  const handleChange = useCallback(() => {
    if (editorRef.current) {
      setValue("contents", editorRef.current.getInstance().getMarkdown());
    }
  }, []);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.getInstance().removeHook("change");
      editorRef.current.getInstance().addHook("change", handleChange);
    }
  }, [handleChange]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.getInstance().setMarkdown("");
    }
  }, []);
  return (
    <Editor
      ref={editorRef}
      placeholder="내용을 입력해주세요."
      initialValue=""
      initialEditType="wysiwyg"
      style={{ height: "100%" }}
      previewStyle="vertical"
      toolbarItems={toolbarItems}
      plugins={[colorSyntax]}
      hideModeSwitch={true}

      // hooks={{ addImageBlobHook: onUploadImage }}
    />
  );
};

export default ToastEditor;
