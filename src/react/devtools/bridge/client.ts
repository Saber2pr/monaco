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
  return new Promise<BridgeWall>((resolve, reject) => {
    const socket = io(socketUrl)
    socket.on('error', reject)
    socket.on('connect', () => {
      const wall = {
        listen(listener) {
          socket.on('message', data => {
            if (data.uid === UID) {
              listener(data)
            }
          })
        },
        send(event, payload) {
          const data = { event, payload, uid: UID }
          socket.emit('message', data)
        },
        close: () => socket.close(),
      }
      resolve(wall)
    })
    socket.on('disconnect', () => {})
  })
}
