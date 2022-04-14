/*
 * @Author: saber2pr
 * @Date: 2020-05-05 20:55:00
 * @Last Modified by: saber2pr
 * @Last Modified time: 2020-05-05 21:14:08
 */
export type IMonaco = import('@monaco-editor/loader').Monaco

export type CompilerOptions = Parameters<
  IMonaco['languages']['typescript']['typescriptDefaults']['setCompilerOptions']
>[0]

export type PromiseType<T> = T extends Promise<infer P> ? P : never
