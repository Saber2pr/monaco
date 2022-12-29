import 'normalize.css'

import React from 'react'
import ReactDOM from 'react-dom'

import ReduxDevtools from '../../../lib/react/devtools/redux'

export const App = () => {
  return (
    <>
      <ReduxDevtools />
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
