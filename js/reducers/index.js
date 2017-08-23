import { combineReducers } from 'redux'
import fs from 'fs'
import path from 'path'

import app from './app'
import calendar from './calendar'
import status from './status'
import subway from './subway'

const reducers = {}
const req = require.context('../widgets', true, /^\.\/.*\.js$/)

// load widget reducers
fs.readdirSync(path.resolve(__dirname, '../widgets'))
  .forEach(widget => {
    fs.readdirSync(path.resolve(__dirname, '../widgets', widget))
      .forEach(file => {
        if (file !== 'reducer.js') return
        reducers[widget] = req('./' + widget + '/' + file).default
      })
  })

export default combineReducers({
  app,
  calendar,
  status,
  subway,
  ...reducers,
})
