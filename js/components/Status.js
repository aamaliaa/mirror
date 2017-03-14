import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import _ from 'underscore'

import { status as config } from '../config'
import { fetchSubwayStatus } from '../actions/status'

class Status extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchSubwayStatus())

    this._interval = setInterval(() => {
      dispatch(fetchSubwayStatus())
    }, config.delay)
  }

  componentWillUnmount() {
    clearInterval(this._interval)
  }

  render() {
    console.log('status render')

    const status = this.parseStatus()

    if (!status) {
      return <div>{''}</div>
    }

    return (
      <div>
        <h3>Service Changes</h3>
        {status}
      </div>
    )
  }

  parseStatus() {
    const { status } = this.props
    const filters = config.regexFilters
    let s = ''
    for (let i=0; i<status.length; i++) {
      for (let j=0; j<filters.length; j++) {
        if (filters[j].test(status[i].name) && status[i].status !== 'GOOD SERVICE') {
          s += status[i].text
        }
      }
    }

    if (s === '') {
      return false
    }

    const text = s
      .replace(/<(br)\/?>/gi, '')
      .replace(/\[(.*?)\]/g, match => {
        const route = match.match(/\[(.+?)\]/)[1]
        return '<div class="subway subway-' + route + '">' + route + '</div>'
      })

    return (
      <div
        className="status"
        dangerouslySetInnerHTML={{__html: text}}
      />
    )
  }

}

export default connect(state => state.status)(Status)
