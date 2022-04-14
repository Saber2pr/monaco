/*
 * @Author: saber2pr
 * @Date: 2020-04-10 15:05:30
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-06 15:25:47
 */
import loader from '@monaco-editor/loader'

import { IMonaco, PromiseType } from './monaco'

import { commonOptions, getTsCompilerOptions } from './options'
import { updateCompilerOptions } from './typescript'

export interface ModalFiles {
  [fileName: string]: string
}

export type EditorOptions = Parameters<IMonaco['editor']['create']>[1]

export async function createEditor(
  editorContainer: HTMLElement,
  modalFiles: ModalFiles,
  options: EditorOptions = {}
) {
  const monaco = await loader.init()
  const models = monaco.editor.getModels()
  const fileMap = models.reduce((acc, m) => {
    const filePath = m.uri.toString()
    const key = filePath.replace(/^file:\/\//, '')
    return { ...acc, [key]: m }
  }, {})

  const data = Object.fromEntries(
    Object.entries(modalFiles).reduce((acc, [fileName, content]) => {
      if (fileName in fileMap) {
        return acc
      }
      const model = monaco.editor.createModel(
        content,
        undefined, // infer from uri
        monaco.Uri.file(fileName)
      )
      // options
      model.updateOptions(commonOptions)
      return acc.concat([[fileName, { state: null, model }]])
    }, [])
  )

  const defaultOpenFile = Object.keys(modalFiles)[0]
  const editor = monaco.editor.create(editorContainer, {
    model: data[defaultOpenFile].model,
    wordWrap: 'on',
    ...options,
  })
  // tsconfig
  updateCompilerOptions(monaco, getTsCompilerOptions(monaco))

  function setValue(value: string, fileName?: string) {
    if (fileName === undefined) {
      editor.setValue(value)
    } else {
      if (fileName in data) {
        data[fileName].model.setValue(value)
      } else {
        throw new Error(`file ${fileName} is not found in data.`)
      }
    }
  }

  function getValue(fileName?: string) {
    if (fileName === undefined) {
      return editor.getValue()
    } else {
      if (fileName in data) {
        return data[fileName].model.getValue()
      } else {
        throw new Error(`file ${fileName} is not found in data.`)
      }
    }
  }

  function getState(fileName: string) {
    if (fileName in data) {
      return data[fileName].state
    } else {
      throw new Error(`type ${fileName} is not found in data.`)
    }
  }
  function setState(fileName: string, state: any) {
    if (fileName in data) {
      data[fileName].state = state
    } else {
      throw new Error(`type ${fileName} is not found in data.`)
    }
  }

  function getData() {
    return data
  }

  function getInstance() {
    return editor
  }

  const setSize = (width: number, height: number) =>
    editor.layout({ width, height })
  const getSize = () => editor.getLayoutInfo()

  function getModel(fileName?: string) {
    if (fileName === undefined) {
      return editor.getModel()
    } else {
      if (fileName in data) {
        return data[fileName].model
      } else {
        throw new Error(`file ${fileName} is not found in data.`)
      }
    }
  }

  function changeModel(fileName: string) {
    if (fileName in data) {
      const currentState = editor.saveViewState()
      const currentModel = editor.getModel()
      for (const type in data) {
        const lastLayout = data[type]
        if (currentModel === lastLayout.model) {
          lastLayout.state = currentState
        }
      }
      editor.setModel(data[fileName].model)
      editor.restoreViewState(data[fileName].state)
      editor.focus()
    } else {
      throw new Error(`file ${fileName} is not found in data.`)
    }
  }

  const getMarkers = () => {
    return monaco.editor.getModelMarkers({
      resource: editor.getModel().uri,
    })
  }

  return {
    monaco,
    setValue,
    getValue,
    getInstance,
    changeModel,
    getData,
    setSize,
    getSize,
    getModel,
    getState,
    setState,
    getMarkers,
  }
}

export type EditorAPI = PromiseType<ReturnType<typeof createEditor>>
