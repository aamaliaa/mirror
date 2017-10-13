import React from 'react'
import { connect } from 'react-redux'
import { mouseTrap } from 'react-mousetrap'
import moment from 'moment'
import cx from 'classnames'
import { ipcRenderer } from 'electron'

import { getAppLastUpdated, showCommandWithTimeout } from './actions'

import Clock from './widgets/clock'
import Weather from './widgets/weather'
import Subway from './widgets/subway'
import Calendar from './widgets/calendar'
import Chores from './widgets/chores'
import Citibike from './widgets/citibike'

import utils from './utils'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      date: new Date(),
      mainContent: '',
      hotword: false,
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
    // setInterval(() => {
    //   dispatch(getAppLastUpdated())
    // }, 30000) // 30 secs

    // clock
    setInterval(() => {
      this.setState({ date: new Date() })
    }, 1000)

    ipcRenderer.on('hotword', (event, arg) => {
      this.setState({ hotword: true })
    })

    ipcRenderer.on('partial-results', (event, arg) => {
      this.showContent(arg)
    })

    ipcRenderer.on('final-results', (event, arg) => {
      const text = arg.trim()
      dispatch(showCommandWithTimeout(text))
      this.showContent(text)

      this.setState({ hotword: false })
    })
  }

  componentWillUnmount() {
    this.props.unbindShortcut('down')
    this.props.unbindShortcut('up')
  }

  shouldComponentUpdate(nextProps, nextState) {
    // new render only if minute updates (since we're not displaying seconds)
    // or main content has changed
    return (
      (nextState.date.getMinutes() !== this.state.date.getMinutes()) ||
      (nextState.mainContent !== this.state.mainContent) ||
      (nextState.hotword !== this.state.hotword)
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
    setTimeout(() => this.setState({ mainContent: '' }), 5000)
  }

  render() {
    const { date, mainContent, hotword } = this.state
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
      <div
        className={cx('app', { hotword })}
      >
        <div className="left">
          <Weather />
          <Citibike />
          <Calendar className="widget-bottom" />
        </div>
        <div className="right">
          <Clock date={date} />
          <Subway />
          <Chores className="widget-bottom" date={date} />
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
