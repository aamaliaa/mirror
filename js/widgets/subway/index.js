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

  renderContent() {
    const { error, trains } = this.props
    if (_.isEmpty(config.stops) || !Object.keys(trains).length || error) {
      return null
    }
    return (
      <div>
        <h5>
          <i className="logo" /> Subway
        </h5>
        {Object.keys(trains).map(routeId => (
          <SubwayLine
            key={routeId}
            routeId={routeId}
            times={trains[routeId]['S']}
          />
        ))}
      </div>
    )
  }
}

const SubwayLine = ({ routeId, times }) => {
  let msg = null
  if (times.length < 1) return null

  const lineConfig = config.stops.find((stop) => times[0].stationId === stop.stationId)
  const { timeToWalk } = lineConfig

  times.map(t => {
    const { arrivalTime } = t
    const arrivalFromNow = utils.formatTime(arrivalTime)
    const timeToLeave = arrivalFromNow.numMin - timeToWalk
    if (arrivalFromNow.numMin && timeToLeave >= 0 && !msg) {
      msg = timeToLeave === 0 ? 'now' : `in ${timeToLeave} min`
    }
  })

  if (!msg) return null

  return (
    <div className="line">
      <div className={'subway subway-' + routeId}>{routeId}</div>
      <div className="text">Leave {msg}</div>
    </div>
  )
}

export default connect(state => state.subway)(Subway)
