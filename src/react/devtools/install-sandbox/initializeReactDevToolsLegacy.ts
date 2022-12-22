import {
  initialize as initializeDevTools,
  activate,
} from 'react-devtools-inline/backend'

export function initializeReactDevToolsLegacy() {
  if (!window.opener) {
    // The dispatch needs to happen before initializing, so that the backend can already listen
    window.parent.postMessage({ type: 'activate-react-devtools' }, '*')

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
    activate(window)
  }
}

export default initializeReactDevToolsLegacy
