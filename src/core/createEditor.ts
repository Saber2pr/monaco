/*
 * @Author: saber2pr
 * @Date: 2020-04-10 15:05:30
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-06 15:25:47
 */
import loader from '@monaco-editor/loader'

import { KEYS, DefaultThemesUri } from '../constants'
import {
  CompilerOptions,
  EditorOptions,
  ICodeEditorViewState,
  IMonaco,
  ITextModel,
  PromiseType,
  ThemeNames,
} from './monaco'
import { commonOptions, getTsCompilerOptions } from './options'
import * as ts from './typescript'

export interface ModalFiles {
  [fileName: string]: string
}

export interface EditorData {
  [fileName: string]: {
    state: ICodeEditorViewState
    model: ITextModel
  }
}

export async function createEditor(
  editorContainer: HTMLElement,
  modalFiles: ModalFiles,
  options: EditorOptions = {},
  loaderConfig?: Parameters<typeof loader.config>[0] & { themeUri?: string }
) {
  loaderConfig && loader.config(loaderConfig)

  const monaco = await loader.init()
  const models = monaco.editor.getModels()
  const fileMap = models.reduce((acc, m) => {
    const filePath = m.uri.toString()
    const key = filePath.replace(/^file:\/\//, '')
    return { ...acc, [key]: m }
  }, {})

  const data: EditorData = Object.fromEntries(
    Object.entries(modalFiles).reduce((acc, [fileName, content]) => {
      let model: ITextModel = null
      if (fileName in fileMap) {
        model = fileMap[fileName]
      } else {
        model = monaco.editor.createModel(
          content,
          undefined, // infer from uri
          monaco.Uri.file(fileName)
        )
      }

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
  ts.updateCompilerOptions(monaco, getTsCompilerOptions(monaco))

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

  const getMarkers = (fileName?: string) => {
    return monaco.editor.getModelMarkers({
      resource: getModel(fileName)?.uri,
    })
  }

  const hasTheme = (theme: string) =>
    // @ts-ignore
    editor._themeService._knownThemes.has(theme)

  const getThemeList = () =>
    fetch(`${loaderConfig?.themeUri || DefaultThemesUri}themelist.json`).then(
      res => res.json()
    )

  const getThemeConfig = (themeFile: string) =>
    fetch(
      `${loaderConfig?.themeUri || DefaultThemesUri}${themeFile}.json`
    ).then(res => res.json())

  const setTheme = async (themeName: ThemeNames) => {
    if (hasTheme(themeName)) {
      monaco.editor.setTheme(themeName)
      localStorage.setItem(KEYS.__EDITOR_EDITOR_THEME__, themeName)
    } else {
      const themes = await getThemeList()
      const themeFile = themes[themeName]
      if (themeFile) {
        getThemeConfig(themeFile).then(themeData => {
          monaco.editor.defineTheme(themeName, themeData)
          monaco.editor.setTheme(themeName)
          localStorage.setItem(KEYS.__EDITOR_EDITOR_THEME__, themeName)
        })
      }
    }
  }

  const getOutput = async (fileName?: string) => {
    const markers = getMarkers(fileName)
    const out = await ts.compileTS(monaco, getModel(fileName)?.uri)
    return {
      ...out,
      markers,
    }
  }

  const addExtraLib = (content: string, filePath?: string) =>
    ts.addExtraLib(monaco, content, filePath)

  const getTypescriptDefaults = () => ts.getTypescriptDefaults(monaco)

  const compileTS = (uri?: InstanceType<IMonaco['Uri']>) =>
    ts.compileTS(monaco, uri || getModel()?.uri)

  const updateCompilerOptions = (options: CompilerOptions) =>
    ts.updateCompilerOptions(monaco, options)

  const addModuleDeclaration = (url: string, moduleName?: string) =>
    ts.addModuleDeclaration(monaco, url, moduleName)

  const getNavigationBarItems = (uri?: InstanceType<IMonaco['Uri']>) =>
    ts.getNavigationBarItems(monaco, uri || getModel()?.uri)

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
    // theme
    setTheme,
    hasTheme,
    getThemeConfig,
    getThemeList,
    // ts
    getOutput,
    addExtraLib,
    getTypescriptDefaults,
    compileTS,
    updateCompilerOptions,
    addModuleDeclaration,
    getNavigationBarItems,
  }
}

export type EditorAPI = PromiseType<ReturnType<typeof createEditor>>
