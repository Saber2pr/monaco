import { SymbolNode } from './SymbolNode'
import type ts from 'typescript'

const getSymbolFromStack = (
  tree: ts.NavigationBarItem[],
  target: ts.NavigationBarItem,
) =>
  tree.find(
    (item) =>
      item.kind === target.kind &&
      item.text === target.text &&
      item.spans[0].start === target.spans[0].start &&
      item.spans[0].length === target.spans[0].length,
  )

export const buildSymbolsTree = (
  tree: ts.NavigationBarItem[],
  current = tree,
) => {
  const children: SymbolNode[] = []

  for (const item of current) {
    console.log('🚀 ~ file: buildSymbolsTree.ts ~ line 23 ~ item', item.kind)
    const node = new SymbolNode(item)

    if (item.childItems.length > 0) {
      node.children = buildSymbolsTree(tree, item.childItems)
    } else {
      const link = getSymbolFromStack(tree, item)
      if (link) {
        node.children = buildSymbolsTree(tree, link.childItems)
      }
    }

    children.push(node)
  }

  return children
}
