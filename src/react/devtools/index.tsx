import React, { useEffect, useState, useCallback } from 'react'
import * as reactDevtools from 'react-devtools-inline/frontend'
import { Container } from './index.style'

const timeout = (delay = 1000) =>
  new Promise((resolve) => setTimeout(resolve, delay))

export type StatusType = 'info' | 'warning' | 'error' | 'success' | 'clear'

export type DevToolProps = {
  hidden?: boolean
  sandboxId?: string
  browserTheme?: 'light' | 'dark'
}

export const DevTools: React.FC<DevToolProps> = (props) => {
  const [ReactDevTools, setDevTools] = useState(null)
  const unmounted = React.useRef(false)

  const loadIframe = useCallback(async () => {
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

      window.addEventListener('message', (event) => {
        const message = event.data
        if (message.type === 'activate-react-devtools') {
          setDevTools(reactDevtools.initialize(contentWindow))
        }
      })
    }
  }, [])

  useEffect(() => {
    loadIframe()
    return () => {
      unmounted.current = true
    }
  }, [loadIframe])

  if (props.hidden) {
    return null
  }

  return (
    <Container>
      {ReactDevTools ? (
        <ReactDevTools browserTheme={props.browserTheme || 'light'} />
      ): <span style={{color: '#000'}}>[Waiting for Sandbox]...</span>}
    </Container>
  )
}

export default DevTools