import { DEFAULT_PORT, DEFAULT_SOCKETURL } from './config'
import { Server } from 'socket.io'

export interface CreateSocketBridgeWallServerOps {
  frontendUid: string
  backendUid: string
}

export const createSocketBridgeWallServer = ({
  frontendUid,
  backendUid,
}: CreateSocketBridgeWallServerOps) => {
  const io = new Server({
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      allowedHeaders: [],
      credentials: true,
    },
  })

  io.listen(DEFAULT_PORT)

  // proxy message
  io.on('message', data => {
    console.log(`[bridge proxy] ${JSON.stringify(data)}`)
    if (data.uid === frontendUid) {
      io.emit({ ...data, uid: backendUid })
    } else if (data.uid === backendUid) {
      io.emit({ ...data, uid: frontendUid })
    }
  })

  console.log(`[bridge proxy socket]`, DEFAULT_SOCKETURL)
  return io
}
