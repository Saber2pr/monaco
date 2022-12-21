import React, { useEffect, useState, useCallback } from 'react'
import * as reactDevtools from 'react-devtools-inline/frontend'
import { createSocketBridgeWall } from './bridge/client'
import { DEFAULT_UID_FRONTEND } from './bridge/config'
import { Container } from './index.style'

const timeout = (delay = 1000) =>
  new Promise(resolve => setTimeout(resolve, delay))

export type StatusType = 'info' | 'warning' | 'error' | 'success' | 'clear'

export type DevToolProps = {
  hidden?: boolean
  sandboxId?: string
  browserTheme?: 'light' | 'dark'
  onMessage?(data: any): void
  useSocket?: boolean
  [k: string]: any
}

export const DevTools: React.FC<DevToolProps> = props => {
  const [ReactDevTools, setDevTools] = useState(null)
  const unmounted = React.useRef(false)

  const loadIframe = useCallback(async () => {
    if (props.useSocket) {
      const wall = await createSocketBridgeWall({
        UID: DEFAULT_UID_FRONTEND,
      })
      wall.listen(message => {
        if (message.event === 'activate-react-devtools') {
          const bridge = reactDevtools.createBridge(window, wall)
          const store = reactDevtools.createStore(bridge)
          const ops = { bridge, store }
          setDevTools(reactDevtools.initialize(window, ops))
        }
      })
      return wall
    } else {
      let iframe = document.getElementById(props.sandboxId) as HTMLIFrameElement

      // iframe hasn't initialized or just isn't there
      while (iframe === null && !unmounted.current) {
        // Retry every second
        // eslint-disable-next-line
        await timeout(1000)
        iframe = document.getElementById(props.sandboxId) as HTMLIFrameElement
      }

      if (iframe) {
        const { contentWindow } = iframe
        window.addEventListener('message', event => {
          const message = event.data
          if (message.type === 'activate-react-devtools') {
            setDevTools(reactDevtools.initialize(contentWindow))
          }
        })
      }
    }
  }, [])

  useEffect(() => {
    const res = loadIframe()
    return () => {
      unmounted.current = true
      if (res) {
        res.then(wall => wall && wall.close())
      }
    }
  }, [loadIframe])

  if (props.hidden) {
    return null
  }

  return (
    <Container>
      {ReactDevTools ? (
        <ReactDevTools
          {...props}
          browserTheme={props.browserTheme || 'light'}
        />
      ) : (
        <span style={{ color: '#000' }}>[Waiting for Sandbox]...</span>
      )}
    </Container>
  )
}

export default DevTools
