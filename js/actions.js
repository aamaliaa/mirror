import fs from 'fs'
import utils from './utils'

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
