import loader from '@monaco-editor/loader'
import React, { CSSProperties, useEffect, useRef } from 'react'

import { createDiffEditor, DiffEditorAPI } from '../core'

export interface DiffEditorProps {
  original: string
  modified: string
  language?: string
  onInit?: (editor: DiffEditorAPI) => any
  deps?: any[]
  style?: CSSProperties
  loaderConfig?: Parameters<typeof loader.config>[0]
}

export const DiffEditor: React.FC<DiffEditorProps> = ({
  onInit,
  original,
  modified,
  language,
  deps,
  style,
  loaderConfig
}) => {
  const ref = useRef<HTMLDivElement>()

  useEffect(() => {
    if (ref.current) {
      createDiffEditor(ref.current, original, modified, language, loaderConfig).then(
        editor => {
          if (onInit) {
            onInit(editor)
          }
        }
      )
    }
  }, deps)

  return <div style={style} ref={ref}></div>
}
