import { DEFAULT_PORT, DEFAULT_SOCKETURL } from './config'
import { Server } from 'socket.io'

export const createSocketBridgeWallServer = () => {
  const io = new Server({
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      allowedHeaders: [],
      credentials: true,
    },
  })

  io.listen(DEFAULT_PORT)
  console.log(`[bridge socket]`, DEFAULT_SOCKETURL)
  return io
}
