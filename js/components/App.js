import React from 'react'
import { connect } from 'react-redux'
import { mouseTrap } from 'react-mousetrap'
import moment from 'moment'

import { getAppLastUpdated } from '../actions/app'

import Clock from './Clock'
import Weather from './Weather'
import Subway from './Subway'
import Status from './Status'
import Calendar from './Calendar'
import Chores from './Chores'

import utils from '../utils'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      date: new Date(),
      mainContent: ''
    }
  }

  componentWillMount() {
    this.props.bindShortcut('down', this.showIP)
    this.props.bindShortcut('up', this.showLastUpdated)
  }

  componentDidMount() {
    const { dispatch } = this.props

    // TODO ONLY in production
    // version polling
    setInterval(() => {
      dispatch(getAppLastUpdated())
    }, 30000) // 30 secs

    // clock
    setInterval(() => {
      this.setState({
        date: new Date()
      })
    }, 1000)
  }

  componentWillUnmount() {
    this.props.unbindShortcut('down')
  }

  shouldComponentUpdate(nextProps, nextState) {
    // new render only if minute updates (since we're not displaying seconds)
    // or main content has changed
    return (
      (nextState.date.getMinutes() !== this.state.date.getMinutes()) ||
      (nextState.mainContent !== this.state.mainContent)
    )
  }

  onChange = (state) => {
    this.setState({ app: state })
  }

  showIP = () => {
    utils.getLocalIP()
    .then(ip => this.showContent(ip))
  }

  showLastUpdated = () => {
    this.showContent('last updated ' + moment(this.props.lastUpdated).fromNow())
  }

  showContent = (mainContent) => {
    this.setState({ mainContent })
    setTimeout(() => this.setState({ mainContent: '' }), 10000)
  }

  render() {
    const { date, mainContent } = this.state
    let error = null
    if (this.props.error) {
      error = (
        <div id="error">
          <i className="fa fa-exclamation-triangle" />
          CONNECTION ERROR
        </div>
      )
    }
    return (
      <div>
        <div className="left">
          <Weather />
          <Calendar />
        </div>
        <div className="right">
          <Clock date={date} />
          <Subway />
          <Chores date={date} />
          <Status date={date} />
        </div>
        {error}
        <div id="main">
          {mainContent}
        </div>
      </div>
    )
  }

}

export default connect(state => state.app)(mouseTrap(App))
