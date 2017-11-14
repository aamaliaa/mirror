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

  renderSchedules() {
    const { schedules, activeRoute, alerts } = this.props
    if (!schedules[activeRoute]) return null

    return (
      <div className="subway-schedules">
        <div className="subway-column">
          <h5>Downtown</h5>
          <SubwayLine
            key={`${activeRoute}_S`}
            routeId={activeRoute}
            alerts={alerts}
            times={schedules[activeRoute]['S']}
          />
        </div>
        <div className="subway-column">
          <h5>Uptown</h5>
          <SubwayLine
            key={`${activeRoute}_N`}
            routeId={activeRoute}
            alerts={alerts}
            times={schedules[activeRoute]['N']}
          />
        </div>
      </div>
    )
  }

  renderActive() {
    const { error, schedules, alerts, activeRoute } = this.props
    const routeAlerts = alerts[activeRoute]
    return (
      <div className="subway-content-active">
        <div className={'subway subway-large subway-' + activeRoute}>{activeRoute}</div>

        {this.renderSchedules()}
        
        <div className="subway-status">
          {routeAlerts.map((alert, i) => <StatusEntry key={i} {...alert} />)}
          {routeAlerts.length < 1 && 'Good service.'}
        </div>
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
            limit={1}
          />
        ))}
      </div>
    )
  }
}

const SubwayLine = ({ routeId, times, alerts, limit }) => {
  let msg = null
  if (times.length < 1) return null

  const lineConfig = config.stops.find((stop) => times[0].stationId === stop.stationId)
  const { timeToWalk } = lineConfig

  const entries = times.reduce((result, t) => {
    const { arrivalTime } = t
    const arrivalFromNow = utils.formatTime(arrivalTime)
    const timeToLeave = arrivalFromNow.numMin - timeToWalk
    if (arrivalFromNow.numMin && timeToLeave >= 0 && !msg) {
      result.push(timeToLeave)
    }
    return result
  }, [])

  if (entries.length === 0) return null

  return (
    <div>
      {entries.slice(0, limit).map(e => (
        <div className="line" key={e}>
          <div>
            <div className={'subway subway-' + routeId}>{routeId}</div>
            {alerts[routeId].length > 0 && <i className="fa fa-exclamation-triangle" />}
          </div>
          <div className="text">Leave {e === 0 ? 'now' : `in ${e} min`}</div>
        </div>
      ))}
    </div>
  )
}

const StatusEntry = (props) => {
  const entry = props.entry.replace(/\[([A-Z0-9]?)\]/g, match => { // matches (A), (2), etc
    const route = match.match(/\[(.+?)\]/)[1] // matches route inside parentheses
    return '<span class="subway subway-' + route + '">' + route + '</span>'
  })

  return <div className="entry" dangerouslySetInnerHTML={{__html: entry}} />
}

export default connect(state => state.subway)(Subway)
