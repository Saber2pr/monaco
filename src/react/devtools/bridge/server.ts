import { Server, Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'

import reduxDevTools from '@redux-devtools/cli'

import {
  DEFAULT_HOST,
  DEFAULT_PORT,
  DEFAULT_REDUX_PORT,
  DEFAULT_SOCKETURL,
  DEFAULT_UID_BACKEND,
  DEFAULT_UID_FRONTEND,
} from './config'

export interface CreateSocketBridgeWallServerOps {
  frontendUid?: string
  backendUid?: string
  port?: number
  onConnection?: (
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  ) => void
}

export const createSocketBridgeWallServer = ({
  frontendUid = DEFAULT_UID_FRONTEND,
  backendUid = DEFAULT_UID_BACKEND,
  port = DEFAULT_PORT,
  onConnection,
}: CreateSocketBridgeWallServerOps = {}) => {
  const io = new Server(port, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      allowedHeaders: [],
      credentials: true,
    },
  })

  io.on('connection', socket => {
    onConnection && onConnection(socket)
    console.log('[bridge connection]')

    // proxy message
    socket.on('message', data => {
      let res = null
      if (data.uid === frontendUid) {
        res = { ...data, uid: backendUid }
      } else if (data.uid === backendUid) {
        res = { ...data, uid: frontendUid }
      }
      if (res) {
        console.log(`[bridge proxy res] ${JSON.stringify(res)}`)
        socket.broadcast.emit('message', res)
      }
    })
  })

  console.log(`[bridge proxy socket]`, DEFAULT_SOCKETURL)
  return io
}

export default createSocketBridgeWallServer

export interface CreateReduxDevToolsBridgeServerOps {
  hostname?: string
  port?: number
}

export const createReduxDevToolsBridgeServer = (
  { hostname, port }: CreateReduxDevToolsBridgeServerOps = {
    hostname: DEFAULT_HOST,
    port: DEFAULT_REDUX_PORT,
  }
) => {
  return reduxDevTools({ hostname, port })
}
