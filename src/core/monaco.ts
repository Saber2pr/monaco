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

export type ITextModel = ReturnType<IMonaco['editor']['createModel']>

export type EditorOptions = Parameters<IMonaco['editor']['create']>[1]

export type IStandaloneCodeEditor = ReturnType<IMonaco['editor']['create']>

export type ICodeEditorViewState = ReturnType<
  IStandaloneCodeEditor['saveViewState']
>

export type ThemeNames =
  | 'active4d'
  | 'all-hallows-eve'
  | 'amy'
  | 'birds-of-paradise'
  | 'blackboard'
  | 'brilliance-black'
  | 'brilliance-dull'
  | 'chrome-devtools'
  | 'clouds-midnight'
  | 'clouds'
  | 'cobalt'
  | 'cobalt2'
  | 'dawn'
  | 'dracula'
  | 'dreamweaver'
  | 'eiffel'
  | 'espresso-libre'
  | 'github'
  | 'idle'
  | 'katzenmilch'
  | 'kuroir-theme'
  | 'lazy'
  | 'magicwb--amiga-'
  | 'merbivore-soft'
  | 'merbivore'
  | 'monokai-bright'
  | 'monokai'
  | 'night-owl'
  | 'oceanic-next'
  | 'pastels-on-dark'
  | 'slush-and-poppies'
  | 'solarized-dark'
  | 'solarized-light'
  | 'spacecadet'
  | 'sunburst'
  | 'textmate--mac-classic-'
  | 'tomorrow-night-blue'
  | 'tomorrow-night-bright'
  | 'tomorrow-night-eighties'
  | 'tomorrow-night'
  | 'tomorrow'
  | 'twilight'
  | 'upstream-sunburst'
  | 'vibrant-ink'
  | 'xcode-default'
  | 'zenburnesque'
  | 'iplastic'
  | 'idlefingers'
  | 'krtheme'
  | 'monoindustrial'
