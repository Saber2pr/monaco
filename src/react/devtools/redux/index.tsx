import React, { useEffect, useMemo } from 'react'
import { Provider, useDispatch } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import * as Core from '@redux-devtools/app'
import App from '@redux-devtools/app/lib/cjs/containers/App'
import configureStore from '@redux-devtools/app/lib/cjs/store/configureStore'

import * as config from '../bridge/config'

export interface ReduxDevtoolsProps {
  socketOptions?: {
    hostname: string
    port: number
    secure: boolean
    type: App.ConnectionType
  }
}

// @ts-ignore
export const ReduxDevtools: React.FC<ReduxDevtoolsProps> = ({
  socketOptions = {
    hostname: config.DEFAULT_HOST,
    port: config.DEFAULT_REDUX_PORT,
    type: 'custom',
    secure: false,
  },
}) => {
  const config = useMemo(() => {
    const { store, persistor } = configureStore(store => {
      if (store.getState().connection.type !== 'disabled') {
        store.dispatch({
          type: Core.CONNECT_REQUEST,
        })
      }
      store.dispatch(Core.saveSocketSettings(socketOptions))
    })
    return { store, persistor }
  }, [socketOptions])

  if (!config.store) return <></>

  return (
    <Provider store={config.store}>
      {/* @ts-ignore */}
      <PersistGate loading={null} persistor={config.persistor!}>
        <App />
      </PersistGate>
    </Provider>
  )
}

export default ReduxDevtools
