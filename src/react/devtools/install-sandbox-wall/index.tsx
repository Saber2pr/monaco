import initializeReactDevToolsLegacyWall from './initializeReactDevToolsLegacy'

// @ts-ignore
window.installSandbox = async () => {
  await initializeReactDevToolsLegacyWall()
}
