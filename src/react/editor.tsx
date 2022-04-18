import React, {
  CSSProperties,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'

import {
  addModuleDeclaration,
  CompilerOptions,
  createEditor,
  EditorAPI,
  EditorOptions,
  ModalFiles,
  updateCompilerOptions,
} from '../core'

export interface EditorProps {
  modalFiles?: ModalFiles
  options?: EditorOptions
  onInit?: (editor: EditorAPI) => any
  deps?: any[]
  style?: CSSProperties
  types?: Record<string, string>
  tsconfig?: CompilerOptions
}

export const Editor = React.forwardRef<EditorAPI, EditorProps>(
  (
    {
      modalFiles = { '/main.tsx': 'console.log("hello")' },
      options,
      onInit,
      deps = [],
      style,
      types = {},
      tsconfig = {},
    },
    parentRef
  ) => {
    const ref = useRef<HTMLDivElement>()
    const apiRef = useRef<EditorAPI>()

    useImperativeHandle(parentRef, () => apiRef.current)

    useEffect(() => {
      if (ref.current) {
        createEditor(ref.current, modalFiles, options).then(editor => {
          apiRef.current = editor
          if (onInit) {
            onInit(editor)
          }
          if (types) {
            Promise.all(
              Object.keys(types).map(name =>
                addModuleDeclaration(
                  editor.monaco,
                  types[name],
                  name.startsWith('global:') ? null : name
                )
              )
            )
          }
          if (tsconfig) {
            updateCompilerOptions(editor.monaco, tsconfig)
          }
        })
      }
    }, deps)

    return <div style={style} ref={ref}></div>
  }
)
