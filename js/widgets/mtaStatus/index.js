import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { connect } from 'react-redux'
import moment from 'moment'
import _ from 'underscore'

import { status as config } from '../../../config'
import { fetchSubwayStatus } from './actions'

class MtaStatus extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      statuses: [],
      idx: 0,
    }
  }

  componentDidMount() {
    this.checkTime(this.props.date)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.status !== this.props.status) {
      this.parseStatus(nextProps)
    }
    if (nextProps.date !== this.props.date) {
      this.checkTime(nextProps.date)
    }
  }

  componentWillUnmount() {
    this.stopPolling()
  }

  checkTime(date) {
    const { dayRange, timeRange } = config
    const today = moment(date).format('dddd').toLowerCase()
    const hour = date.getHours()
    const show = dayRange.includes(today) && (hour >= timeRange[0] && hour <= timeRange[1])

    if (show !== this.state.show) {
      if (show) {
        this.startPolling()
      } else {
        this.stopPolling()
      }
    }

    this.setState({ show })
  }

  startPolling() {
    const { dispatch } = this.props
    dispatch(fetchSubwayStatus())

    this._interval = setInterval(() => {
      dispatch(fetchSubwayStatus())
    }, config.delay)
    this._carousel = setInterval(() => {
      const { idx, statuses } = this.state
      const inc = idx + 1
      this.setState({ idx: inc > statuses.length - 1 ? 0 : inc })
    }, 10000)
  }

  stopPolling() {
    clearInterval(this._interval)
    clearInterval(this._carousel)
  }

  render() {
    const { show, statuses, idx } = this.state

    if (!show || statuses.length < 1) return null
    const status = statuses[idx]

    return (
      <div id="status">
        <h5>MTA DELAYS <span className="time">updated {moment(status.timestamp, 'X').fromNow()}</span></h5>
        <div className="item">
          <ReactCSSTransitionGroup
            transitionName="carousel"
            transitionEnterTimeout={300}
            transitionLeaveTimeout={300}
          >
            {status.status.map((s, j) => <StatusEntry key={j} entry={s} />)}
          </ReactCSSTransitionGroup>
        </div>
      </div>
    )
  }

  parseStatus(props) {
    const { status } = props
    const filters = config.regexFilters
    const trains = config.trains.map(t => `[${t}]`)
    let statuses = []

    if (!status.length) return null

    status.map(s => {
      filters.map(f => {
        if (f.test(s.name) && s.status !== 'GOOD SERVICE') {
          const entries = s.text
            .replace(/<[br][^>]*>/gi, '') // no <br> tags
            .replace(/<b>|<\/b>/gi, '')   // no <b> tags
            .replace(/(\[FF\])/gi, '')    // no Fix & Fortify
            .split(/<p>|<\/p>/i)          // split <p>'s into array
            .map(i => i.trim())           // trim errything
            .filter(i => {
              const matches = i.match(/\[([A-Z0-9]?)\]/g) // match subway symbols (i.e. [2] or [L])
              if (i === '') return false
              if (matches && matches.length > 0 && matches.some(v => trains.includes(v))) return true
            })

          if (entries.length) {
            statuses.push({
              timestamp: moment(`${s.Date.trim()} ${s.Time.trim()}`, 'MM-DD-YYYY hh:mmA').format('X'),
              status: entries,
            })
          }
        }
      })
    })

    this.setState({ statuses, idx: 0 })
  }

}

const StatusEntry = (props) => {
  const entry = props.entry.replace(/\[([A-Z0-9]?)\]/g, match => {
    const route = match.match(/\[(.+?)\]/)[1]
    return '<span class="subway subway-' + route + '">' + route + '</span>'
  })

  return <div className="entry" dangerouslySetInnerHTML={{__html: entry}} />
}

export default connect(state => state.mtaStatus)(MtaStatus)
