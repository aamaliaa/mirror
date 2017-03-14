import React from 'react'
import _ from 'underscore'
import moment from 'moment'
import { chores as config } from '../config'

class Chores extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.date.getHours() !== this.props.date.getHours()
  }

  parseChores() {
    const today = moment(this.props.date).format('dddd').toLowerCase()
    const hour = this.props.date.getHours()
    return config[today].filter(chore => {
      if (!chore.timeRange) {
        return true
      }

      return hour >= chore.timeRange[0] && hour <= chore.timeRange[1]
    })
  }

  render() {
    const chores = this.parseChores()

    return (
      <div id="chores">
        {chores.map((c, i) => {
          return (
            <div className="chore" key={i}>
              <i className={'fa fa-' + c.icon} />
              {c.text}
            </div>
          )
        })}
      </div>
    )
  }
}

Chores.propTypes = {
  date: React.PropTypes.object,
}

export default Chores
