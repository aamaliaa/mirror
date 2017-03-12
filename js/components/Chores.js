import React from 'react'
import _ from 'underscore'
import moment from 'moment'
import { chores as config } from '../config'

class Chores extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.date.getHours() !== this.props.date.getHours()
  }

  parseChores() {
    var today = moment(this.props.date).format('dddd').toLowerCase()
    var hour = this.props.date.getHours()
    return _.filter(config[today], function(chore) {
      if (chore.timeRange) {
        if (hour >= chore.timeRange[0] && hour <= chore.timeRange[1]) {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    })
  }

  render() {
    var chores = this.parseChores()

    return (
      <div id="chores">
        {chores.map(function(c, i) {
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
