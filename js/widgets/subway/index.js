import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import _ from 'underscore'

import Widget from '../'
import utils from '../../utils'

import { subway as config } from '../../../config'
import { fetchSubwayTimes } from './actions'

class Subway extends Widget {
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
          msg: `Leave ${timeToLeave === 0 ? 'now' : `in ${timeToLeave} min`}`,
          routeId,
        }
      }
      return { routeId, arrivalTime, arrivalFromNow }
    })

    return { leave, times }
  }

  renderContent() {
    const { error } = this.props
    if (_.isEmpty(config.stops) || error) {
      return null
    }

    return (
      <div>
        <h5>
          <i className="logo" /> Subway
        </h5>
        {config.stops.map(({ stationId, feedId, direction, timeToWalk }) => {
          const schedule = this.getTimes(stationId, feedId, direction, timeToWalk)
          // if no times then don't show
          if (_.isEmpty(schedule.leave)) {
            return null
          }

          const { routeId, msg } = schedule.leave
          return (
            <SubwayLine
              key={`${feedId}_${stationId}`}
              routeId={routeId}
              msg={msg}
            />
          )
        })}
      </div>
    )
  }
}

const SubwayLine = ({ routeId, msg }) => (
  <div className="line">
    <div className={'subway subway-' + routeId}>{routeId}</div>
    <div className="text">{msg}</div>
  </div>
)

export default connect(state => state.subway)(Subway)
