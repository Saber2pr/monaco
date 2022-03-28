import React, { useEffect, useRef } from 'react'
import { createEditor, EditorAPI, EditorOptions, ModalFiles } from '../core'

export interface EditorProps {
  modalFiles?: ModalFiles
  options?: EditorOptions
  onInit?: (editor: EditorAPI) => any
  deps?: any[]
}

export const Editor: React.FC<EditorProps> = ({
  modalFiles = { 'main.tsx': 'console.log("hello")' },
  options,
  onInit,
  deps = [],
}) => {
  const ref = useRef<HTMLDivElement>()

  useEffect(() => {
    if (ref.current) {
      const editor = createEditor(ref.current, modalFiles, options)
      if (onInit) {
        onInit(editor)
      }
    }
  }, deps)

  return <div ref={ref}></div>
}
