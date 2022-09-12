import styled from 'styled-components'

export const Container = styled.div`
  padding: 8px;
  overflow: auto;
  height: 100%;
`

export const Item = styled.div``
export const ItemTitle = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: #ecf1f8;
  }
`
export const ItemLabel = styled.div``

export const ItemList = styled.div``

export const KindIcon = styled.div<{ src: string; size: number }>`
  background-image: url(${(props) => props.src});
  background-size: ${(props) => `${props.size}px ${props.size}px`};
  width: ${(props) => `${props.size}px`};
  height: ${(props) => `${props.size}px`};
  margin-right: 4px;
`
