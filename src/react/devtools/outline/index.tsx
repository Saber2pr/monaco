import React, { useEffect, useState } from 'react'
import { SymbolNode } from './SymbolNode'
import {
  Container,
  Item,
  ItemLabel,
  ItemList,
  ItemTitle,
  KindIcon,
} from './index.style'
import { getIcon } from './resources/icons'
import { buildSymbolsTree } from './buildSymbolsTree'
import { EditorAPI } from '../../../core'

export interface OutlineProps {
  api: EditorAPI
  theme: 'light' | 'dark'
}

export const Outline: React.FC<OutlineProps> = ({ api, theme = 'light' }) => {
  const [tree, setTree] = useState<SymbolNode[]>([])
  console.log('🚀 ~ file: index.tsx ~ line 22 ~ tree', tree)

  const update = async () => {
    const tree = await api.getNavigationBarItems()
    const bar = buildSymbolsTree(tree)
    if (bar) {
      setTree(bar[0].children)
    }
  }

  useEffect(() => {
    if (api) {
      update()
      const event = api.getModel().onDidChangeContent(update)
      return () => event.dispose()
    }
  }, [api])

  const highlightNode = (node: SymbolNode) => {
    const span = node?.symbol?.spans?.[0]
    if (span) {
      const start = api.getModel().getPositionAt(span.start)
      const end = api.getModel().getPositionAt(span.start + span.length)
      const range = new api.monaco.Range(
        start.lineNumber,
        start.column,
        end.lineNumber,
        end.column
      )
      api.getInstance().setSelection(range)
      api.getInstance().revealRange(range)
    }
  }

  const renderTree = (node: SymbolNode, index = 0, depth = 0) => {
    return (
      <Item key={index} style={{ paddingLeft: depth === 0 ? 0 : 16 }}>
        {node.symbol ? (
          <ItemTitle onClick={() => highlightNode(node)}>
            <KindIcon
              size={theme === 'light' ? 24 : 16}
              src={getIcon(node.symbol.kind)[theme]}
            />
            <ItemLabel>{node.symbol.text}</ItemLabel>
          </ItemTitle>
        ) : (
          <></>
        )}
        <ItemList>
          {node.children.map((item, index) =>
            renderTree(item, index, depth + 1)
          )}
        </ItemList>
      </Item>
    )
  }

  if (!tree) {
    return <>loading...</>
  }

  return (
    <Container>{tree.map((node, index) => renderTree(node, index))}</Container>
  )
}
