import {
  activate,
  createBridge,
  initialize as initializeDevTools,
} from 'react-devtools-inline/backend'

import { BridgeWall } from './interface'

export function initializeReactDevToolsLegacyByWall(wall: BridgeWall) {
  // The dispatch needs to happen before initializing, so that the backend can already listen
  wall.send('activate-react-devtools', null)

  // @ts-ignore
  if (typeof globalThis.__REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined') {
    try {
      // @ts-ignore We need to make sure that the existing chrome extension doesn't interfere
      delete globalThis.__REACT_DEVTOOLS_GLOBAL_HOOK__
    } catch (e) {
      /* ignore */
    }
  }
  // Call this before importing React (or any other packages that might import React).
  initializeDevTools(globalThis)

  const bridge = createBridge(globalThis, wall)
  activate(globalThis, { bridge })
}

export default initializeReactDevToolsLegacyByWall
