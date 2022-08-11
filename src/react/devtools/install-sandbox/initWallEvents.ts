export const initWallEvents = (sandboxId: string, message) => {
  const iframe = document.getElementById(sandboxId)
  if (iframe) {
    // @ts-ignore
    const getInspect = () => iframe?.contentWindow?.inspect

    if (message?.event === 'stopInspectingNative') {
      getInspect().deactivate()
    }

    if (message.event === 'isBackendStorageAPISupported' && message.payload) {
      const __REACT_DEVTOOLS_GLOBAL_HOOK__ =
        // @ts-ignore
        iframe?.contentWindow?.__REACT_DEVTOOLS_GLOBAL_HOOK__

      const reactDevtoolsAgent =
        __REACT_DEVTOOLS_GLOBAL_HOOK__?.reactDevtoolsAgent

      // @ts-ignore
      const wall = reactDevtoolsAgent?._bridge?._wall

      const highElement = (rendererId, id) => {
        if (reactDevtoolsAgent) {
          const interf = reactDevtoolsAgent?.rendererInterfaces?.[rendererId]
          if (interf && interf.findNativeNodesForFiberID) {
            const nodes = interf.findNativeNodesForFiberID(id)
            const node = nodes?.[0]
            if (node) {
              getInspect().log({ target: node })
            }
          }
        }
      }

      if (wall) {
        wall.listen((message: { event: string; payload: any }) => {
          const event = message.event
          const payload = message.payload
          if (event === 'startInspectingNative') {
            getInspect().activate()
          }

          if (event === 'highlightNativeElement') {
            getInspect().activate()
            highElement(payload.rendererID, payload.id)
          }
          if (event === 'stopInspectingNative') {
            getInspect().deactivate()
          }
          if (event === 'clearNativeElementHighlight') {
            getInspect().deactivate()
          }
        })
      }
    }
  }
}
