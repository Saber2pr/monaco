# @saber2pr/monaco

> monaco

```bash
yarn add @saber2pr/monaco
yarn add monaco-editor-webpack-plugin@4.2.0 -D
```

webpack config:

```js
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

config.plugins.push(new MonacoWebpackPlugin())
```

### Usage

editor:

```tsx
import { createEditor } from '@saber2pr/monaco'

// 1. create editor
const editor = createEditor(
  dom,
  {
    // file: file-content
    'input.jsx': "const a = 'hello';",
    'input.css': '#root { color: red; }',
  },
  { theme: 'vs-dark' }
)

// get current modal value
editor.getValue()

// set value to current modal
editor.setValue('code')

// change current modal
editor.changeModel('input.css')

// get modal
editor.getModel('input.jsx').onDidChangeContent
```

diffEditor:

```tsx
import { createDiffEditor } from '@saber2pr/monaco'

// container, oldText, newText, language
createDiffEditor(dom, '{"name": "app"}', '{"name": "subApp"}', 'json')
```
