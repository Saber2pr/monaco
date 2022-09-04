import React, { useEffect, useRef } from 'react'
import { KEYS } from '../../../constants'
import { Container } from './index.style'

export interface ConsolePanelProps {
  sandboxId: string
}

const ClearTip = '<pre class="tip">Console was cleared</pre>'

export const ConsolePanel: React.FC<ConsolePanelProps> = ({ sandboxId }) => {
  const console_ref = useRef<HTMLDivElement>()
  const lastInput = useRef<string>('')

  let consoleContent = ClearTip

  const setupInput = () => {
    const input =
      console_ref.current.querySelector<HTMLInputElement>(`.exec-input>input`)
    if (input) {
      input.onkeydown = e => {
        if (e.key === 'Enter' || e.keyCode === 13) {
          const sandbox = document.querySelector<HTMLIFrameElement>(
            `#${sandboxId}`
          )
          if (sandbox) {
            lastInput.current = input.value
            if (input.value === 'console.clear()') {
              consoleContent = ClearTip
              renderConsole()
            } else {
              sandbox.contentWindow.window.postMessage(
                {
                  method: KEYS.__MESSAGE_CONSOLE_EXEC__,
                  value: encodeURI(input.value),
                },
                '*'
              )
            }
          }
        }
        if (e.key === 'ArrowUp' || e.keyCode === 38) {
          input.value = lastInput.current
        }
      }
    }
  }

  const renderConsole = () => {
    console_ref.current.innerHTML = `${consoleContent}<div class="exec-input"><input autofocus /></div>`
    setupInput()
    console_ref.current.scrollTo({
      top: console_ref.current.scrollHeight,
      behavior: 'smooth',
    })
  }

  const pushConsole = (data: { method: string; value: string }) => {
    if (data.method === KEYS.__MESSAGE_CONSOLE__) {
      consoleContent += `<pre>${data.value}</pre>`
      renderConsole()
    }
    if (data.method === KEYS.__MESSAGE_CONSOLE_ERROR__) {
      consoleContent += `<pre style="color: red;">${data.value}</pre>`
      renderConsole()
    }
  }

  useEffect(() => {
    renderConsole()

    const handle = event => pushConsole(event.data)
    self.addEventListener('message', handle)
    return () => self.removeEventListener('message', handle)
  }, [])

  return <Container ref={console_ref}></Container>
}
