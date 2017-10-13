import moment from 'moment'
import {
  RECEIVE_SUBWAY_TIMES,
  ERROR_SUBWAY_TIMES,
  RECEIVE_SUBWAY_STATUS,
  ERROR_SUBWAY_STATUS,
  COMMAND_ACTIVE_SUBWAY,
  COMMAND_INACTIVE_SUBWAY,
} from './actions'
import {
  allTrains
} from './utils'

// TODO put this in config
const trainsToMonitor = [ '2', '3', 'A', 'B', 'C', 'D' ]
const initialRouteState = { N: [], S: [] }

const schedules = {}
trainsToMonitor.forEach(t => {
  schedules[t] = initialRouteState
})

const alerts = {}
allTrains.forEach(t => {
  alerts[t] = []
})

const parseStatus = (status) => {
  const trainMap = {}
  const trains = allTrains.map(t => `[${t}]`)

  allTrains.forEach(t => {
    trainMap[t] = []
  })

  if (!status.length) return trainMap

  status.map(s => {
    if (s.name !== 'SIR' && s.status !== 'GOOD SERVICE') {
      s.text
        .replace(/<[br][^>]*>/gi, '') // no <br> tags
        .replace(/<b>|<\/b>/gi, '')   // no <b> tags
        .replace(/(\[FF\])/gi, '')    // no Fix & Fortify
        .split(/<p>|<\/p>/i)          // split <p>'s into array
        .map(i => i.trim())           // trim errything
        .forEach(entry => {
          if (entry === '') return
          const matches = entry
            .match(/\[([A-Z0-9]?)\]/g) // match subway symbols (i.e. [2] or [L])
            .filter((el, i, a) => i === a.indexOf(el)) // get unique

          matches.forEach((m) => {
            const route = m.replace(/[[\]]/g,'')
            if (s.name.includes(route)) {
              trainMap[route].push({ entry, lastUpdated: moment(`${s.Date.trim()} ${s.Time.trim()}`, 'MM-DD-YYYY hh:mmA').format('X') })
            }
          })
        })
    }
  })

  return trainMap
}

const subway = (state = {
  error: null,
  isActive: true,
  alerts,
  schedules,
}, action) => {
  switch (action.type) {
    case COMMAND_ACTIVE_SUBWAY:
      return {
        ...state,
        isActive: true,
      }
    case COMMAND_INACTIVE_SUBWAY:
      return {
        ...state,
        isActive: false,
      }
    case RECEIVE_SUBWAY_TIMES:
      const newRouteSchedules = {}
      const { stationId, times: { schedule } } = action

      Object.keys(schedule[stationId]).map((direction) => {
        const times = schedule[stationId][direction]
        times.map((t) => {
          const { routeId } = t
          if (!newRouteSchedules[routeId]) {
            newRouteSchedules[routeId] = { N: [], S: [] }
          }
          if (!newRouteSchedules[routeId][direction]) {
            newRouteSchedules[routeId][direction] = []
          }

          newRouteSchedules[routeId][direction].push({ ...t, stationId })
        })
      })

      return {
        ...state,
        schedules: {
          ...state.schedules,
          ...newRouteSchedules,
        }
      }
    case RECEIVE_SUBWAY_STATUS:
      return {
        ...state,
        alerts: parseStatus(action.status),
      }
    case ERROR_SUBWAY_STATUS:
    case ERROR_SUBWAY_TIMES:
      return {
        ...state,
        error: action.error,
      }
    default:
      return state
  }
}

export default subway
