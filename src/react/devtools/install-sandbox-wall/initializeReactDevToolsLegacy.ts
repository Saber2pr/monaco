import { createSocketBridgeWall } from '../bridge/client'
import { DEFAULT_UID_BACKEND } from '../bridge/config'
import initializeReactDevToolsLegacyByWall from '../bridge/backend'

export interface InitializeReactDevToolsLegacyWallOps {
  debug?: boolean
}

// inject to app
export function initializeReactDevToolsLegacyWall({
  debug = false,
}: InitializeReactDevToolsLegacyWallOps = {}) {
  return initializeReactDevToolsLegacyByWall(
    createSocketBridgeWall({ UID: DEFAULT_UID_BACKEND, debug })
  )
}

export default initializeReactDevToolsLegacyWall
