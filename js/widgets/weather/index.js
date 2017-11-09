import React from 'react'
import { connect } from 'react-redux'
import cx from 'classnames'
import _ from 'underscore'
import moment from 'moment'
import Widget from '../'
import { weather as config } from '../../config'
import { fetchWeather } from './actions'

class Weather extends Widget {
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

  renderToday() {
    const { currently, daily: { data: [ dailyData ] }, hourly: { summary } } = this.props.weather
    const temp = Math.round(currently.temperature)
    const tempMax = Math.round(dailyData.temperatureMax)
    const tempMin = Math.round(dailyData.temperatureMin)
    const feelsLike = Math.round(currently.apparentTemperature)
    const precipitation = Math.round(dailyData.precipProbability * 100)

    return (
      <div>
        <WeatherDay
          className="currently"
          temperature={temp}
          temperatureMin={tempMin}
          temperatureMax={tempMax}
          icon={currently.icon}
        />
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

  renderFuture() {
    const { daily: { icon, summary, data } } = this.props.weather
    return (
      <div>
        <p>{summary}</p>
        <div className="weather-week">
          {data.slice(1).map(({ temperatureMax, temperatureMin, icon, time }) => (
            <WeatherDay
              key={time}
              temperatureMax={Math.round(temperatureMax)}
              temperatureMin={Math.round(temperatureMin)}
              icon={icon}
              day={moment.unix(time).format('dddd')}
            />
          ))}
        </div>
      </div>
    )
  }

  renderActive() {
    if (_.isEmpty(this.props.weather) || this.props.error) {
      return (
        <div>
          <div className="error">{this.props.error && this.props.error.message === 'Internal Server Error' ? 'Weather offline.' : (this.props.error && this.props.error.message || '')}</div>
        </div>
      )
    }

    return (
      <div>
        {this.renderToday()}
        {this.renderFuture()}
      </div>
    )
  }

  renderContent() {
    if (_.isEmpty(this.props.weather) || this.props.error) {
      return (
        <div>
          <div className="error">{this.props.error && this.props.error.message === 'Internal Server Error' ? 'Weather offline.' : (this.props.error && this.props.error.message || '')}</div>
        </div>
      )
    }

    return this.renderToday()
  }

}

const WeatherDay = ({ className, temperature, temperatureMin, temperatureMax, icon, day }) => {
  return (
    <div className={cx('weather-day', className)}>
      {temperature && <div className="temperature">{`${temperature}°`}</div>}
      <div className="icon-wrapper">
        <div className={"weather-icon " + icon} />
        <div className="high-low">
          <span className="low">{`${temperatureMin}°`}</span>&nbsp;&nbsp;<span className="high">{`${temperatureMax}°`}</span>
        </div>
        {day && <div className="day">{day}</div>}
      </div>
    </div>
  )
}

export default connect(state => state.weather)(Weather)
