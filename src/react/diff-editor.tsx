import React, { CSSProperties, useEffect, useRef } from 'react'

import { createDiffEditor, DiffEditorAPI } from '../core'

export interface DiffEditorProps {
  original: string
  modified: string
  language?: string
  onInit?: (editor: DiffEditorAPI) => any
  deps?: any[]
  style?: CSSProperties
}

export const DiffEditor: React.FC<DiffEditorProps> = ({
  onInit,
  original,
  modified,
  language,
  deps,
  style,
}) => {
  const ref = useRef<HTMLDivElement>()

  useEffect(() => {
    if (ref.current) {
      createDiffEditor(ref.current, original, modified, language).then(
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
