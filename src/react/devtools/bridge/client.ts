import { io } from 'socket.io-client'
import { DEFAULT_SOCKETURL, DEFAULT_UID_FRONTEND } from './config'
import { BridgeWall } from './interface'

export interface CreateSocketBridgeWallOps {
  socketUrl?: string
  UID: string
  debug?: boolean
}

export const createSocketBridgeWall = (
  {
    socketUrl = DEFAULT_SOCKETURL,
    UID,
    debug = false,
  }: CreateSocketBridgeWallOps = { UID: DEFAULT_UID_FRONTEND }
) => {
  const socket = io(socketUrl)
  const wall: BridgeWall = {
    listen(listener) {
      const handle = data => {
        if (data.uid === UID) {
          if (debug) {
            console.log(
              `[bridge client msg] ${UID} receive ${JSON.stringify(data)}`
            )
          }
          listener(data)
        }
      }
      socket.on('message', handle)
      return () => socket.off('message', handle)
    },
    send(event, payload) {
      const data = { event, payload, uid: UID }
      socket.emit('message', data)
    },
    close: () => socket.disconnect(),
  }

  return wall
}
