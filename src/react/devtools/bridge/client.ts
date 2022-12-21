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

const cache = new Set()

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
            console.log(`[socket msg] ${JSON.stringify(data)}`)
            if (data.uid === UID && !cache.has(data.t)) {
              console.log(
                `[bridge client msg] ${UID} receive ${JSON.stringify(data)}`
              )
              listener(data)
              cache.add(data.t)
            }
          })
        },
        send(event, payload) {
          const data = { event, payload, uid: UID, t: Date.now() }
          socket.emit('message', data)
        },
        close: () => socket.close(),
      }
      resolve(wall)
    })
    socket.on('disconnect', () => {})
  })
}
