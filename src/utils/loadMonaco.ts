import loader from '@monaco-editor/loader'

export const loadMonaco = async (
  params: Parameters<typeof loader.config>[0]
) => {
  loader.config(params)
  const moanco = await loader.init()
  return moanco
}
