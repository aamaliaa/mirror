import { combineReducers } from 'redux'
import path from 'path'
import fs from 'fs'

import {
  SET_APP_LAST_UPDATED,
  SET_APP_ERROR
} from './actions'

const reducers = {}
const req = require.context('./widgets', true, /^\.\/.*\.js$/)

const appState = {
  lastUpdated: null,
  error: null,
}

const app = (state = appState, action) => {
  switch (action.type) {
    case SET_APP_ERROR:
      return {
        ...state,
        error: action.error,
      }
    case SET_APP_LAST_UPDATED:
      return {
        ...state,
        lastUpdated: action.lastUpdated,
      }
    default:
      return state
  }
}

// load all widget reducers
fs.readdirSync(path.resolve(__dirname, './widgets'))
  .forEach(widget => {
    if (/.js/.test(widget)) return // only read directories
    fs.readdirSync(path.resolve(__dirname, './widgets', widget))
      .forEach(file => {
        if (file !== 'reducer.js') return
        reducers[widget] = req('./' + widget + '/' + file).default
      })
  })

export default combineReducers({
  app,
  ...reducers,
})
