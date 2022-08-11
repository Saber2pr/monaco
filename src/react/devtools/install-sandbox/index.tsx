import initializeReactDevToolsLegacy from './initializeReactDevToolsLegacy'
import { Inspector } from './inspector'

// @ts-ignore
window.installSandbox = async () => {
  await initializeReactDevToolsLegacy()
  // @ts-ignore
  window.inspect = new Inspector()
}
