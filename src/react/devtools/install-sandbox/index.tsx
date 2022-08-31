import initializeReactDevToolsLegacy from './initializeReactDevToolsLegacy'

// @ts-ignore
window.installSandbox = async () => {
  await initializeReactDevToolsLegacy()
}
