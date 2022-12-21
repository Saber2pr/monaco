import { DEFAULT_UID_BACKEND } from './../bridge/config'
import {
  initialize as initializeDevTools,
  activate,
  createBridge,
} from 'react-devtools-inline/backend'
import { createSocketBridgeWall } from '../bridge/client'

// inject to app
export async function initializeReactDevToolsLegacyWall() {
  if (!window.opener) {
    // create socket connection
    const wall = await createSocketBridgeWall({ UID: DEFAULT_UID_BACKEND })
    const bridge = createBridge(global, wall)

    // The dispatch needs to happen before initializing, so that the backend can already listen
    wall.send('activate-react-devtools', null)

    // @ts-ignore
    if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined') {
      try {
        // @ts-ignore We need to make sure that the existing chrome extension doesn't interfere
        delete window.__REACT_DEVTOOLS_GLOBAL_HOOK__
      } catch (e) {
        /* ignore */
      }
    }
    // Call this before importing React (or any other packages that might import React).
    initializeDevTools(window)
    activate(window, {
      bridge,
    })
  }
}

export default initializeReactDevToolsLegacyWall
