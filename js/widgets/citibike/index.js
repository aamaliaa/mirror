import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import { citibike as config } from '../../../config'
import { fetchCitibikeStation } from './actions'

class Citibike extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchCitibikeStation())

    this._interval = setInterval(() => {
      dispatch(fetchCitibikeStation())
    }, config.delay)
  }

  componentWillUnmount() {
    clearInterval(this._interval)
  }

  render() {
    const { error } = this.props
    if (_.isEmpty(config.stations) || error) {
      return null
    }

    return (
      <div id="citibike">
        <h5>CITIBIKE</h5>
        <div className="station header">
          <div className="name" />
          <div className="number">bikes</div>
        </div>
        {config.stations.map(({ id }) => <StationStatus key={id} {...this.props[id]} />)}
      </div>
    )
  }
}

const StationStatus = ({ station_name, station_id, num_bikes_available, num_docks_available }) => {
  return (
    <div className="station">
      <div className="name">{station_name}</div>
      <div className="number">{num_bikes_available}</div>
      <ProgressBar percentage={(num_bikes_available / num_docks_available) * 100} />
    </div>
  )
}

const ProgressBar = ({ percentage }) => {
  return (
    <div className="progress-bar">
      <div className="complete" style={{ width: `${percentage}%` }}/>
    </div>
  )
}

export default connect(state => state.citibike)(Citibike)
