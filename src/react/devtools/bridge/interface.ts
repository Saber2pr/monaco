export interface BridgeWall {
  listen(listener: any): VoidFunction
  send(event: any, payload: any): void
  close: VoidFunction
}
