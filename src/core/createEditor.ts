/*
 * @Author: saber2pr
 * @Date: 2020-04-10 15:05:30
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-06 15:25:47
 */
import { commonOptions } from './options'
import { IMonaco, monaco } from './monaco'

export interface ModalFiles {
  [fileName: string]: {
    lang: string
    content: string
  }
}

export function createEditor(
  editorContainer: HTMLElement,
  modalFiles: ModalFiles,
  options: Parameters<IMonaco['editor']['create']>[1] = {}
) {
  const data = Object.fromEntries(
    Object.entries(modalFiles).map(([fileName, { lang, content }]) => {
      const model = monaco.editor.createModel(
        content,
        lang,
        monaco.Uri.file(fileName)
      )
      model.updateOptions(commonOptions)
      return [fileName, { state: null, model }]
    })
  )

  const defaultOpenFile = Object.keys(modalFiles)[0]
  const editor = monaco.editor.create(editorContainer, {
    model: data[defaultOpenFile].model,
    wordWrap: 'on',
    ...options,
  })

  function setValue(fileName: string, value?: string) {
    if (value === undefined) {
      editor.setValue(fileName)
    } else {
      if (fileName in data) {
        data[fileName].model.setValue(value)
      } else {
        throw new Error(`type ${fileName} is not found in data.`)
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
        throw new Error(`type ${fileName} is not found in data.`)
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
  function setState(fileName: string, state) {
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
        throw new Error(`type ${fileName} is not found in data.`)
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
      throw new Error(`type ${fileName} is not found in data.`)
    }
  }

  return {
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
  }
}

export type EditorAPI = ReturnType<typeof createEditor>
