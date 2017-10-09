import React from 'react'
import moment from 'moment'
import Widget from '../'

class Clock extends Widget {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.date.getMinutes() !== this.props.date.getMinutes()
  }

  renderContent() {
    const d = this.props.date
    const m = moment(d)
    return(
      <div>
        <div className="container">
          <div className="time">{m.format('h:mm')}</div>
          <div className="date">{m.format('dddd')}, {m.format('MMMM Do')}</div>
        </div>
      </div>
    )
  }

}

export default Clock
