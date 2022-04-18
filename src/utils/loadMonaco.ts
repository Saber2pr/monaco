import loader from '@monaco-editor/loader'

export const loadMonaco = () => loader.init().then(moanco => moanco)