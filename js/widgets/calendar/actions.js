import fs from 'fs'
import moment from 'moment'

// google doesn't do webpack
const google = require('googleapis')
const googleAuth = require('google-auth-library')

import utils from '../../utils'
import { api } from '../../../config'

const googleCalSecretPath = api.googleCalSecretPath
const googleCalTokenPath = api.googleCalTokenPath
const googleCalScopes = ['https://www.googleapis.com/auth/calendar.readonly']

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
const authorize = (credentials, callback) => {
  var clientSecret = credentials.installed.client_secret
  var clientId = credentials.installed.client_id
  var redirectUrl = credentials.installed.redirect_uris[0]
  var auth = new googleAuth()
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl)

  // Check if we have previously stored a token.
  fs.readFile(googleCalTokenPath, (err, token) => {
    if (err) {
      getNewToken(oauth2Client, callback)
    } else {
      oauth2Client.credentials = JSON.parse(token)
      callback(oauth2Client)
    }
  })
}

const getCalendar = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(googleCalSecretPath, (err, content) => {
      if (err) return reject(err)
      // Authorize a client with the loaded credentials, then call the
      // Google Calendar API.
      authorize(JSON.parse(content), (auth) => {
        const calendar = google.calendar('v3')
  			const now = moment()

        calendar.events.list({
          auth: auth,
          calendarId: 'primary',
          timeMin: now.utc().format(),
          timeMax: now.add(1, 'days').utc().format(),
          singleEvents: true,
          orderBy: 'startTime'
        }, (err, response) => {
          if (err) return reject(err)
          resolve(response.items)
        })
      })
    })
  })
}

export const REQUEST_CALENDAR = 'REQUEST_CALENDAR'
export const RECEIVE_CALENDAR = 'RECEIVE_CALENDAR'
export const ERROR_CALENDAR = 'ERROR_CALENDAR'

export function requestCalendar() {
  return { type: REQUEST_CALENDAR }
}

export function receiveCalendar(calendar) {
  return { type: RECEIVE_CALENDAR, calendar }
}

export function errorCalendar(error) {
  return { type: ERROR_CALENDAR, error }
}

export function fetchCalendar() {
  return (dispatch, getState) => {
    dispatch(requestCalendar())
    return getCalendar()
      .then(data => dispatch(receiveCalendar(data)))
      .catch(err => dispatch(errorCalendar(err)))
  }
}
