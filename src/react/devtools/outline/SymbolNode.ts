import type typescript from 'typescript'

export type SymbolInformation = typescript.NavigationBarItem

export class SymbolNode {
  parent?: SymbolNode
  symbol: SymbolInformation
  children: SymbolNode[]

  constructor(symbol?: SymbolInformation) {
    this.children = []
    this.symbol = symbol
  }

  addChild(child: SymbolNode) {
    child.parent = this
    this.children.push(child)
  }
}
