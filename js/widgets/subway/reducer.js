import {
  REQUEST_SUBWAY_TIMES,
  RECEIVE_SUBWAY_TIMES,
  ERROR_SUBWAY_TIMES,
} from './actions'

const initialRouteState = { N: [], S: [] }

function subway(state = {
  error: null,
  trains: {
    'A': initialRouteState,
    'B': initialRouteState,
    'C': initialRouteState,
    'D': initialRouteState,
    '2': initialRouteState,
    '3': initialRouteState,
  },
}, action) {
  switch (action.type) {
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
        trains: {
          ...state.trains,
          ...newRouteSchedules,
        }
      }
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
