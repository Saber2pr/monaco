import styled from 'styled-components'

export const Container = styled.div`
  height: 100%;
  overflow: auto;
  font-size: 12px;
  background-color: #fff;
  pre {
    line-height: 1.5rem;
    margin: 0;
    border-bottom: 1px solid #e8e8e8;
    padding-left: 20px;
    min-height: 20px;
    &:hover {
      background-color: #ecf1f8;
      border-bottom: 1px solid #ccdef5;
    }
    &.tip {
      color: gray;
    }
  }
  .exec-input {
    position: relative;
    input {
      display: block;
      height: 20px;
      width: 100%;
      padding-left: 20px;
      border: none;
      border-bottom: 1px solid #e8e8e8;
      outline: none;
    }
    &::before {
      content: '>';
      position: absolute;
      left: 6px;
      line-height: 20px;
      color: #80aaf7;
    }
  }
`
