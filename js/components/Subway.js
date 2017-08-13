import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import _ from 'underscore'

import utils from '../utils'

import { subway as config } from '../config'
import { fetchSubwayTimes } from '../actions/subway'

class Subway extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchSubwayTimes())

    this._interval = setInterval(() => {
      dispatch(fetchSubwayTimes())
    }, config.delay)
  }

  componentWillUnmount() {
    clearInterval(this._interval)
  }

  getTimes = (stationId, feedId, direction, timeToWalk) => {
    const schedule = (this.props[`${feedId}_${stationId}`] && this.props[`${feedId}_${stationId}`][direction].slice(0, 5)) || []
    let leave
    const times = schedule.map(t => {
      const { arrivalTime, routeId } = t
      const arrivalFromNow = utils.formatTime(arrivalTime)
      const timeToLeave = arrivalFromNow.numMin - timeToWalk

      if (arrivalFromNow.numMin && timeToLeave >= 0 && !leave) {
        leave = {
          msg: `Leave ${
            (timeToLeave === 0) ?
              'now' :
              `within ${timeToLeave} minute${timeToLeave > 1 ? 's' : ''}`
          }`,
          routeId
        }
      }
      return { routeId, arrivalTime, arrivalFromNow }
    })

    return { leave, times }
  }

  renderSubway = (data) => {
    const { routeId, msg } = data
    return (
      <div className="message">
        <div className={'subway subway-' + routeId}>{routeId}</div>
        <div className="text">{msg}</div>
      </div>
    )
  }

  render() {
    const { error } = this.props
    if (_.isEmpty(config.stops) || error) {
      return null
    }

    return (
      <div>
        {config.stops.map(({ stationId, feedId, direction, timeToWalk }) => {
          var schedule = this.getTimes(stationId, feedId, direction, timeToWalk)
          // if no times then don't show
          if (_.isEmpty(schedule.leave)) {
            return null
          }
          return <div key={`${feedId}_${stationId}`} id="subway">{this.renderSubway(schedule.leave)}</div>
        })}
      </div>
    )
  }
}

export default connect(state => state.subway)(Subway)
