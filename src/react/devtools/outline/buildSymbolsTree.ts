import { SymbolNode } from './SymbolNode'
import type ts from 'typescript'
import { getArray } from '@saber2pr/utils/lib/array'

const getSymbolFromStack = (
  tree: ts.NavigationBarItem[],
  target: ts.NavigationBarItem
) =>
  getArray(tree).find(
    item =>
      item.kind === target.kind &&
      item.text === target.text &&
      item.spans[0].start === target.spans[0].start &&
      item.spans[0].length === target.spans[0].length
  )

export const buildSymbolsTree = (
  tree: ts.NavigationBarItem[],
  current = getArray(tree)
) => {
  const children: SymbolNode[] = []

  for (const item of current) {
    const node = new SymbolNode(item)

    const childItems = getArray(item.childItems)

    if (childItems.length > 0) {
      node.children = buildSymbolsTree(tree, childItems)
    } else {
      const link = getSymbolFromStack(tree, item)
      if (link) {
        node.children = buildSymbolsTree(tree, getArray(link.childItems))
      }
    }

    children.push(node)
  }

  return children
}
