# @saber2pr/monaco

> monaco

```bash
yarn add @saber2pr/monaco
```

### Usage

```tsx
import { createEditor } from '@saber2pr/monaco'

// 1. create editor
const editor = createEditor(
  dom,
  {
    // file: file-content
    'input.jsx': "const a = 'hello';",
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
