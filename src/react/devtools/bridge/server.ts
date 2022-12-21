import {
  DEFAULT_PORT,
  DEFAULT_SOCKETURL,
  DEFAULT_UID_BACKEND,
  DEFAULT_UID_FRONTEND,
} from './config'
import { Server, Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'

export interface CreateSocketBridgeWallServerOps {
  frontendUid?: string
  backendUid?: string
  onConnection?: (
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  ) => void
}

export const createSocketBridgeWallServer = ({
  frontendUid = DEFAULT_UID_FRONTEND,
  backendUid = DEFAULT_UID_BACKEND,
  onConnection,
}: CreateSocketBridgeWallServerOps) => {
  const io = new Server(DEFAULT_PORT, {
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
      console.log(`[bridge proxy] ${JSON.stringify(data)}`)
      if (data.uid === frontendUid) {
        socket.emit({ ...data, uid: backendUid })
      } else if (data.uid === backendUid) {
        socket.emit({ ...data, uid: frontendUid })
      }
    })
  })

  console.log(`[bridge proxy socket]`, DEFAULT_SOCKETURL)
  return io
}
