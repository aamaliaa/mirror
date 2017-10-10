import fs from 'fs'
import utils from './utils'
import commands from './commands'

/*
 * action types
 */
export const SET_APP_LAST_UPDATED = 'SET_APP_LAST_UPDATED'
export const SET_APP_ERROR = 'SET_APP_ERROR'

/*
 * action creators
 */
export function setAppLastUpdated(lastUpdated) {
  return { type: SET_APP_LAST_UPDATED, lastUpdated }
}

export function setAppError(error) {
  return { type: SET_APP_ERROR, error }
}

export const showCommandWithTimeout = (cmd) => (dispatch, getState) => {
  // TODO figure out better matching strategy... annyang?
  const widget = commands[cmd]
  console.log(cmd, commands[cmd])
  if (!widget) return // TODO *shrug*?

  console.log(widget)
  dispatch({ type: `COMMAND_ACTIVE_${widget}` })
  setTimeout(() => {
    dispatch({ type: `COMMAND_INACTIVE_${widget}` })
  }, 15000)
}

const checkLastUpdated = () => {
  return new Promise((resolve, reject) => {
    fs.stat(__dirname + '/dist/bundle.js', function(err, stats) {
      if (err) return reject(err)
  		resolve({ lastUpdated: stats.ctime })
  	})
  })
}

export function getAppLastUpdated() {
  return (dispatch, getState) => {
    return checkLastUpdated()
      .then(data => dispatch(setAppLastUpdated(data.lastUpdated)))
      .catch(err => dispatch(setAppError(err)))
  }
}
