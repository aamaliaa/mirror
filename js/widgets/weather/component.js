import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import { weather as config } from '../../config'
import { fetchWeather } from './actions'

class Weather extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchWeather())

    this._interval = setInterval(() => {
      dispatch(fetchWeather())
    }, config.delay)
  }

  componentWillUnmount() {
    clearTimeout(this._interval)
  }

  render() {
    if (_.isEmpty(this.props.weather) || this.props.error) {
      return (
        <div id="weather">
          <div className="error">{this.props.error && this.props.error.message === 'Internal Server Error' ? 'Weather offline.' : (this.props.error && this.props.error.message || '')}</div>
        </div>
      )
    }

    const { currently, daily: { data: [ dailyData ] }, hourly: { summary } } = this.props.weather
    const temp = Math.round(currently.temperature)
    const tempMax = Math.round(dailyData.temperatureMax)
    const tempMin = Math.round(dailyData.temperatureMin)
    const feelsLike = Math.round(currently.apparentTemperature)
    const precipitation = Math.round(dailyData.precipProbability * 100)

    return (
      <div id="weather">
        <div className="currently">
          <div className="temperature">{`${temp}°`}</div>
          <div className="icon-wrapper">
            <div className={"weather-icon " + currently.icon} />
            <div className="high-low">
              <span className="high">{`${tempMax}°`}</span>&nbsp;&nbsp;<span className="low">{`${tempMin}°`}</span>
            </div>
          </div>
        </div>
        <div className="feelsLike">Feels like {feelsLike}°</div>
        <div className="summary">{summary}</div>
        {precipitation > 0 && (
          <div className="precipitation">
            <i className="fa fa-umbrella"></i> {precipitation + '%'}
          </div>
        )}
      </div>
    )
  }

}

export default connect(state => state.weather)(Weather)
