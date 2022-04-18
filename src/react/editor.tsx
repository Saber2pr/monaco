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
  ThemeNames,
  updateCompilerOptions,
} from '../core'

export interface EditorProps {
  className?: string
  modalFiles?: ModalFiles
  options?: EditorOptions
  onInit?: (editor: EditorAPI) => any
  deps?: any[]
  style?: CSSProperties
  types?: Record<string, string>
  tsconfig?: CompilerOptions
  theme?: ThemeNames
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
      theme,
      className,
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
          if (theme) {
            editor.setTheme(theme)
          }
        })
      }
    }, deps)

    return <div className={className} style={style} ref={ref}></div>
  }
)
