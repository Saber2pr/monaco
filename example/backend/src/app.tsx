import 'normalize.css'

import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'

import { Title } from './app.style'
import { View } from '@/components'

export const App = () => {
  useEffect(() => {
    const a: IConfig = { test: '' }
    console.log('test')
  }, [])
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
