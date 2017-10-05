import React from 'react'
import moment from 'moment'

class Clock extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.date.getMinutes() !== this.props.date.getMinutes()
  }

  render() {
    const d = this.props.date
    const m = moment(d)
    return(
      <div id="clock">
        <div className="container">
          <div className="time">{m.format('h:mm')}</div>
          <div className="date">{m.format('dddd')}, {m.format('MMMM Do')}</div>
        </div>
        <div className="clearfix" />
      </div>
    )
  }

}

export default Clock
