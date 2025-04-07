import React, { useCallback, useEffect, useState } from 'react'
import * as reactDevtools from 'react-devtools-inline/frontend'

import { BridgeWall } from './bridge/interface'
import { createSocketBridgeWall } from './bridge/client'
import { Container } from './index.style'
import config from './bridge/config'

const timeout = (delay = 1000) =>
  new Promise(resolve => setTimeout(resolve, delay))

export type StatusType = 'info' | 'warning' | 'error' | 'success' | 'clear'

export type DevToolProps = {
  hidden?: boolean
  sandboxId?: string
  browserTheme?: 'light' | 'dark'
  onMessage?(data: any): void
  debug?: boolean
  wall?: BridgeWall
  renderLoading?: () => React.ReactNode
  [k: string]: any
}

export function DevTools({
  renderLoading = () => (
    <span style={{ color: '#000' }}>[Waiting for Sandbox]...</span>
  ),
  wall,
  ...props
}: DevToolProps) {
  const [ReactDevTools, setDevTools] = useState(null)
  const unmounted = React.useRef(false)

  const loadIframe = useCallback(async () => {
    if (wall) {
      const cancel = wall.listen(message => {
        if (message.event === 'activate-react-devtools') {
          const bridge = reactDevtools.createBridge(window, wall)
          const store = reactDevtools.createStore(bridge)
          setDevTools(reactDevtools.initialize(window, { bridge, store }))
        }
      })
      return () => {
        cancel && cancel()
        wall.close()
      }
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
  }, [wall])

  useEffect(() => {
    const res = loadIframe()
    return () => {
      unmounted.current = true
      if (res) {
        res.then(clean => clean && clean())
      }
    }
  }, [loadIframe])

  if (props.hidden) {
    return null
  }

  return (
    <Container>
      {/* @ts-ignore */}
      {ReactDevTools ? (
        <ReactDevTools
          {...props}
          browserTheme={props.browserTheme || 'light'}
        />
      ) : (
        renderLoading()
      )}
    </Container>
  )
}

DevTools.createSocketBridgeWall = createSocketBridgeWall
DevTools.config = config

export default DevTools
