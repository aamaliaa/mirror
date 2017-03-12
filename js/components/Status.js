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

    this._interval = setInterval(function() {
      dispatch(fetchSubwayStatus())
    }, config.delay)
  }

  componentWillUnmount() {
    clearInterval(this._interval)
  }

  render() {
    console.log('status render')

    var status = this.parseStatus()

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
    var s = this.props.status
    var filters = config.regexFilters
    var status = ''
    for (var i=0; i<s.length; i++) {
      for (var j=0; j<filters.length; j++) {
        if (filters[j].test(s[i].name) && s[i].status !== 'GOOD SERVICE') {
          status += s[i].text
        }
      }
    }

    if (status === '') {
      return false
    }

    var text = status
      .replace(/<(br)\/?>/gi, '')
      .replace(/\[(.*?)\]/g, function(match) {
        var route = match.match(/\[(.+?)\]/)[1]
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
