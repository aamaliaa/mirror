import utils from '../utils'

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

export function getAppLastUpdated() {
  return (dispatch, getState) => {
    return utils.getLastUpdated()
      .then(res => res.json())
      .then(json => dispatch(setAppLastUpdated(json.lastUpdated)))
      .catch(err => dispatch(setAppError(err)))
  }
}
