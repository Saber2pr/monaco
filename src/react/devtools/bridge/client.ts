import { io } from 'socket.io-client'
import { DEFAULT_SOCKETURL, DEFAULT_UID_FRONTEND } from './config'

export interface CreateSocketBridgeWallOps {
  socketUrl?: string
  UID?: string
}

export interface BridgeWall {
  listen(listener: any): void
  send(event: any, payload: any): void
  close: VoidFunction
}

export const createSocketBridgeWall = ({
  socketUrl = DEFAULT_SOCKETURL,
  UID = DEFAULT_UID_FRONTEND,
}: CreateSocketBridgeWallOps = {}) => {
  const socket = io(socketUrl)
  const wall = {
    listen(listener) {
      const handle = data => {
        if (data.uid === UID) {
          console.log(
            `[bridge client msg] ${UID} receive ${JSON.stringify(data)}`
          )
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
