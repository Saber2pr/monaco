/*
 * @Author: saber2pr
 * @Date: 2020-05-05 20:50:32
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-06 15:13:33
 */
import { getReferencePaths, resolvePath } from '../utils'
import { CompilerOptions, IMonaco } from './monaco'

export const getTypescriptDefaults = (monaco: IMonaco) =>
  monaco.languages.typescript.typescriptDefaults

export const addExtraLib = (
  monaco: IMonaco,
  content: string,
  filePath?: string
) => {
  const defaults = getTypescriptDefaults(monaco)
  if (filePath) {
    const libs = defaults.getExtraLibs() || {}
    if (filePath in libs) {
      return
    }
  }
  return filePath
    ? defaults.addExtraLib(content, filePath)
    : defaults.addExtraLib(content)
}

export const compileTS = async (
  monaco: IMonaco,
  uri: InstanceType<IMonaco['Uri']>
) => {
  const tsWorker = await monaco.languages.typescript.getTypeScriptWorker()
  const client = await tsWorker(uri)
  const fileName = uri.toString()
  const diagnostics = await client.getSemanticDiagnostics(fileName)
  const result = await client.getEmitOutput(fileName)
  const files = result.outputFiles[0]
  return {
    output: files.text,
    diagnostics,
  }
}

export const updateCompilerOptions = (
  monaco: IMonaco,
  options: CompilerOptions
) => {
  const CompilerOptions = getTypescriptDefaults(monaco).getCompilerOptions()
  getTypescriptDefaults(monaco).setCompilerOptions({
    ...CompilerOptions,
    ...options,
  })
}

const ExtraLibs = {}
export const addModuleDeclaration = async (
  monaco: IMonaco,
  url: string,
  moduleName?: string
) => {
  const key = url
  if (key in ExtraLibs) {
    return ExtraLibs[key]
  }

  let text = ''
  try {
    const res = await fetch(url)
    if (res.ok) {
      text = await res.text()
    }
  } catch (error) {}

  if (text) {
    const paths = getReferencePaths(text)
    await Promise.all(
      paths.map(path => addModuleDeclaration(monaco, resolvePath(url, path)))
    )
  }

  const wrapped = moduleName
    ? `declare module "${moduleName}" { ${text} }`
    : text
  const lib = addExtraLib(monaco, wrapped, moduleName)
  ExtraLibs[key] = lib
}
