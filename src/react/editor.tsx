import React, { CSSProperties, useEffect, useRef } from 'react'
import { createEditor, EditorAPI, EditorOptions, ModalFiles } from '../core'

export interface EditorProps {
  modalFiles?: ModalFiles
  options?: EditorOptions
  onInit?: (editor: EditorAPI) => any
  deps?: any[]
  style?: CSSProperties
}

export const Editor: React.FC<EditorProps> = ({
  modalFiles = { 'main.tsx': 'console.log("hello")' },
  options,
  onInit,
  deps = [],
  style,
}) => {
  const ref = useRef<HTMLDivElement>()

  useEffect(() => {
    if (ref.current) {
      createEditor(ref.current, modalFiles, options).then(editor => {
        if (onInit) {
          onInit(editor)
        }
      })
    }
  }, deps)

  return <div style={style} ref={ref}></div>
}
