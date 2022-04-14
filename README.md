# @saber2pr/monaco

> monaco

```bash
yarn add @saber2pr/monaco
```

### Usage

editor:

```tsx
import { createEditor } from '@saber2pr/monaco'

// 1. create editor
const editor = await createEditor(
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
