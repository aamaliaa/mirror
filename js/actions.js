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
  let command = null
  for (let i = 0; i<commands.length; i++) {
    const { pattern } = commands[i]
    const m = pattern.exec(cmd)
    if (m) command = { ...commands[i], matches: m }
  }

  if (!command) return // TODO *shrug*?
  const { widgetName, matches } = command

  dispatch({ type: `COMMAND_ACTIVE_${widgetName.toUpperCase()}`, args: matches.slice(1) })
  setTimeout(() => {
    dispatch({ type: `COMMAND_INACTIVE_${widgetName.toUpperCase()}` })
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
