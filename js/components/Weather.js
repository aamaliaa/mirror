var React = require('react');
var _ = require('underscore');
var config = require('../config').weather;

var WeatherActions = require('../actions/WeatherActions');
var WeatherStore = require('../stores/WeatherStore');

var Weather = React.createClass({

  getInitialState: function() {
    return WeatherStore.getState();
  },

  componentDidMount: function() {
    WeatherActions.get();
    WeatherStore.listen(this.onChange);

    this._interval = setInterval(function() {
      WeatherActions.get();
    }, config.delay);
  },

  componentWillUnmount: function() {
    WeatherStore.unlisten(this.onChange);
    clearTimeout(this._interval);
  },

  onChange: function (state) {
    this.setState(state);
  },

  render: function() {
    console.log('weather render');

    if (_.isEmpty(this.state.weather)) {
      return <div>{this.state.error || ''}</div>;
    }

    var w = this.state.weather;
    var temp = Math.round(w.currently.temperature);
    var tempMax = Math.round(w.daily.data[0].temperatureMax);
    var tempMin = Math.round(w.daily.data[0].temperatureMin);
    var feelsLike = Math.round(w.currently.apparentTemperature);
    var summary = w.hourly.summary;
    var precipitation = Math.round(w.daily.data[0].precipProbability * 100)
    var currentIcon = w.currently.icon;

    return (
      <div id="weather">
        <div className="currently">
          <div className="temperature">{temp + '°'}</div>
          <div className="icon-wrapper">
            <div className={"weather-icon " + currentIcon} />
            <div className="high-low">
              <span className="high">{`${tempMax}°`}</span>&nbsp;&nbsp;<span className="low">{`${tempMin}°`}</span>
            </div>
          </div>
        </div>
        <div className="feelsLike">Feels like {feelsLike}&deg;</div>
        <div className="summary">{summary}</div>
        {precipitation > 0 && (
          <div className="precipitation">
            <i className="fa fa-umbrella"></i> {precipitation + '%'}
          </div>
        )}
      </div>
    );
  }

});

module.exports = Weather;
