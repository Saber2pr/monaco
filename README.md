# @saber2pr/monaco

> monaco

```bash
yarn add @saber2pr/monaco
```

### Usage

```tsx
import { createEditor } from '@saber2pr/monaco'

const editor = createEditor(
  dom,
  {
    'input.jsx': {
      lang: 'javascript',
      content: localStorage.getItem('input'),
    },
  },
  { theme: 'vs-dark' }
)

editor.getValue('input.jsx')
editor.setValue('input.jsx', 'code')
editor.getModel('input.jsx').onDidChangeContent
```
