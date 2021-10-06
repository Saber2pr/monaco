/*
 * @Author: saber2pr
 * @Date: 2020-05-05 20:50:32
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-06 15:13:33
 */
import { getReferencePaths, resolvePath } from '../utils'
import { monaco } from './monaco'

const typescriptDefaults = monaco.languages.typescript.typescriptDefaults
export const addExtraLib = (content: string, filePath?: string) =>
  typescriptDefaults.addExtraLib(content, filePath)

export const compileTS = async (uri: InstanceType<typeof monaco.Uri>) => {
  const tsWorker = await monaco.languages.typescript.getTypeScriptWorker()
  const client = await tsWorker(uri)
  const result = await client.getEmitOutput(uri.toString())
  const files = result.outputFiles[0]
  return files.text
}

export const updateCompilerOptions = (
  options: Parameters<typeof typescriptDefaults.setCompilerOptions>[0]
) => {
  const CompilerOptions = typescriptDefaults.getCompilerOptions()
  typescriptDefaults.setCompilerOptions({
    ...CompilerOptions,
    ...options,
  })
}

const ExtraLibs = {}
export const addModuleDeclaration = async (
  url: string,
  moduleName?: string
) => {
  const key = url
  if (key in ExtraLibs) {
    return ExtraLibs[key]
  }

  const text = await fetch(url).then(res => res.text())

  const paths = getReferencePaths(text)
  await Promise.all(
    paths.map(path => addModuleDeclaration(resolvePath(url, path)))
  )

  const wrapped = moduleName
    ? `declare module "${moduleName}" { ${text} }`
    : text
  const lib = addExtraLib(wrapped, moduleName)
  ExtraLibs[key] = lib
}
