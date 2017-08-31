require('style-loader!../stylus/styles.styl');

import React from 'react'
import { Provider } from 'react-redux'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './reducers'

import App from './App'

const configureStore = () => {
  return createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(
      thunkMiddleware,
    )
  )
}

render(
  (
    <Provider store={configureStore()}>
      <App />
    </Provider>
  ),
  document.getElementById('mirror'),
)
