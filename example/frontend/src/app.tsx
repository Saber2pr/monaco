import 'normalize.css'

import React from 'react'
import ReactDOM from 'react-dom/client'

import Devtools from '../../../lib/react/devtools'

export const App = () => {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Devtools
        wall={Devtools.createSocketBridgeWall({
          UID: Devtools.config.DEFAULT_UID_FRONTEND,
        })}
      />
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(<App />)
