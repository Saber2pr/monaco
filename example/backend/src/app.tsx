import 'normalize.css'

import { Button } from 'antd'
import React from 'react'
import ReactDOM from 'react-dom'

import { View } from '@/components'
import { DownloadOutlined } from '@ant-design/icons'

import { Title } from './app.style'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { store } from './redux'

const Count = () => {
  const count = useSelector<any, number>(state => {
    return state?.count?.value
  })
  console.log('🚀 ~ file: app.tsx:16 ~ Count ~ count', count)
  const dispatch = useDispatch()
  return (
    <div>
      <div>count: {count}</div>
      <div
        onClick={() => {
          dispatch({ type: 'count/add', payload: 1 })
        }}
      >
        add
      </div>
    </div>
  )
}

export const App = () => {
  return (
    <Provider store={store}>
      <Count />
    </Provider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
