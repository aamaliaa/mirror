import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import _ from 'underscore'

import Widget from '../'
import utils from '../../utils'

import { subway as config } from '../../../config'
import { fetchSubwayTimes, fetchSubwayStatus } from './actions'

class Subway extends Widget {
  constructor(props) {
    super(props)
    this.scheduleInterval = null
    this.statusInterval = null
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchSubwayTimes())
    dispatch(fetchSubwayStatus())

    this.scheduleInterval = setInterval(() => {
      dispatch(fetchSubwayTimes())
    }, config.scheduleDelay)

    this.statusInterval = setInterval(() => {
      dispatch(fetchSubwayStatus())
    }, config.statusDelay)
  }

  componentWillUnmount() {
    clearInterval(this.scheduleInterval)
    clearInterval(this.statusInterval)
  }

  renderActive() {
    const { error, schedules, alerts } = this.props
    return (
      <div>
        {Object.keys(alerts).map(routeId => (
          alerts[routeId].map(alert => <StatusEntry {...alert} />)
        ))}
      </div>
    )
  }

  renderContent() {
    const { error, schedules, alerts } = this.props
    if (_.isEmpty(config.stops) || !Object.keys(schedules).length || error) {
      return null
    }
    return (
      <div>
        <h5>
          <i className="logo" /> Subway
        </h5>
        {Object.keys(schedules).map(routeId => (
          <SubwayLine
            key={routeId}
            routeId={routeId}
            alerts={alerts}
            times={schedules[routeId]['S']}
          />
        ))}
      </div>
    )
  }
}

const SubwayLine = ({ routeId, times, alerts }) => {
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
      <div>
        <div className={'subway subway-' + routeId}>{routeId}</div>
        {alerts[routeId].length > 0 && <i className="fa fa-exclamation-triangle" />}
      </div>
      <div className="text">Leave {msg}</div>
    </div>
  )
}

const StatusEntry = (props) => {
  const entry = props.entry.replace(/\[([A-Z0-9]?)\]/g, match => {
    const route = match.match(/\[(.+?)\]/)[1]
    return '<span class="subway subway-' + route + '">' + route + '</span>'
  })

  return <div className="entry" dangerouslySetInnerHTML={{__html: entry}} />
}

export default connect(state => state.subway)(Subway)
