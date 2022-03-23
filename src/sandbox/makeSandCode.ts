/*
 * @Author: saber2pr
 * @Date: 2020-04-24 13:35:03
 * @Last Modified by: saber2pr
 * @Last Modified time: 2020-05-05 20:53:56
 */
import { KEYS } from '../constants'
import { enClosure } from '../utils'
import { ConsoleHook } from './hooks'

interface HtmlContentFiles {
  css?: string
  json?: string
  html?: string
  js?: string
  main?: string
  mainRequireFunc?: string
}

export const makeSandCode = (
  files: HtmlContentFiles,
  mode: 'dev' | 'pro' = 'dev'
) => {
  let code = `${mode === 'dev' ? ConsoleHook : ''}
		 ${files.css ? `<style>${files.css}</style>` : ''}
		 ${
       files.json
         ? `<script>var ${KEYS.__VAR_JSON__} = ${files.json};</script>`
         : ''
     }
		 ${files.html || ''}
		 ${files.js ? `<script>${enClosure(files.js)}</script>` : ''}`

  if (!!files.main) {
    let ts_js = files.main
    if (ts_js.includes('define')) {
      ts_js = ts_js.replace(/define\(/, 'define("index",')
      code += `<script>${ts_js};require(["index"], ${
        files.mainRequireFunc || ''
      })</script>`
    } else {
      code += `<script>${enClosure(ts_js)}</script>`
    }
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(code, 'text/html')
  return `<!DOCTYPE html><html>${doc.children[0].innerHTML}</html>`
}
