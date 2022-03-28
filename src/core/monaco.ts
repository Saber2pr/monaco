/*
 * @Author: saber2pr
 * @Date: 2020-05-05 20:55:00
 * @Last Modified by: saber2pr
 * @Last Modified time: 2022-03-28 15:38:29
 */
import * as Monaco from 'monaco-editor/min/vs/editor/editor.main.js'

export type IMonaco = typeof import('monaco-editor')

export const monaco = Monaco as IMonaco
