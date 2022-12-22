import 'normalize.css'

import { Button } from 'antd'
import React from 'react'
import ReactDOM from 'react-dom'

import { View } from '@/components'
import { DownloadOutlined } from '@ant-design/icons'

import { Title } from './app.style'

export const App = () => {
  return (
    <>
      <Title />
      <main>
        <View />
        <Button icon={<DownloadOutlined />}>test</Button>
      </main>
      <footer>footer</footer>
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
