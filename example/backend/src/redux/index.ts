import { configureStore, applyMiddleware } from '@reduxjs/toolkit'
import devToolsEnhancer from 'remote-redux-devtools'
import * as reducer from './reducers'

export const store = configureStore({
  reducer,
  devTools: false,
  enhancers: [
    devToolsEnhancer({
      realtime: true,
      name: 'Default',
      hostname: '127.0.0.1',
      port: 3000,
      secure: false,
    }),
  ],
})
