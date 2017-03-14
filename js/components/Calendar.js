import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import _ from 'underscore'
import { calendar as config } from '../config'

import { fetchCalendar } from '../actions/calendar'

class Calendar extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchCalendar())

    this._interval = setInterval(() => {
      dispatch(fetchCalendar())
    }, config.delay)
  }

  componentWillUnmount() {
    clearInterval(this._interval)
  }

  isToday(dateTime) {
    const now = moment()
    return dateTime !== undefined && moment(dateTime).date() === now.date()
  }

  renderItems(calendarItems, label) {
    if (_.isEmpty(calendarItems)) {
      return null
    }

    return (
      <div>
        <h5>{label}</h5>
        <ul>
          {calendarItems.map(item => {
            const { id, start: { dateTime: start }, end: { dateTime: end }, summary } = item
            let time = 'ALL DAY'

            if (start && end) {
              time = moment(start).format('LT') + '-' + moment(end).format('LT')
              time = time.replace(/(\s+|:00)/g, '')
            }

            return (
              <li key={id}>
                <i className="fa fa-calendar-o" />
                <span className="time">{time}</span>{summary}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  render() {
    const { calendar } = this.props
    if (_.isEmpty(calendar)) {
      return false
    }

    const now = moment()
    let todayItems = []
    let tomorrowItems = []

    calendar.map(item => {
      if (this.isToday(item.start.dateTime) || this.isToday(item.end.dateTime)) {
        todayItems.push(item)
      } else {
        tomorrowItems.push(item)
      }
    })

    return (
      <div id="calendar">
        {this.renderItems(todayItems, 'today')}
        {this.renderItems(tomorrowItems, 'tomorrow')}
      </div>
    )
  }

}

export default connect(state => state.calendar)(Calendar)
