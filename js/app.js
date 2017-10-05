import React from 'react'
import { connect } from 'react-redux'
import { mouseTrap } from 'react-mousetrap'
import moment from 'moment'
import cx from 'classnames'
import { ipcRenderer } from 'electron'
import RGL, { WidthProvider } from 'react-grid-layout'

import { getAppLastUpdated } from './actions'

import Clock from './widgets/clock'
import Weather from './widgets/weather'
import Subway from './widgets/subway'
import Status from './widgets/mtaStatus'
import Calendar from './widgets/calendar'
import Chores from './widgets/chores'
import Citibike from './widgets/citibike'

import utils from './utils'

const ReactGridLayout = WidthProvider(RGL)

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
      setTimeout(() => {
        this.setState({ hotword: false })
      }, 3000)
    })

    ipcRenderer.on('partial-results', (event, arg) => {
      this.showContent(arg)
    })

    ipcRenderer.on('final-results', (event, arg) => {
      this.showContent(arg)
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
    setTimeout(() => this.setState({ mainContent: '' }), 10000)
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

    const layout = [
      {i: 'clock', x: 0, y: 0, w: 2, h: 1},
      {i: 'weather', x: 4, y: 0, w: 2, h: 2},
      {i: 'citibike', x: 0, y: 1, w: 2, h: 1},
      {i: 'subway', x: 4, y: 1, w: 2, h: 1},
      {i: 'chores', x: 2, y: 0, w: 2, h: 1},
      {i: 'status', x: 4, y: 2, w: 2, h: 1},
      {i: 'calendar', x: 0, y: 2, w: 2, h: 1},
    ]
    return (
      <ReactGridLayout
        className={cx('layout', { hotword })}
        layout={layout}
        verticalCompact={false}
        rowHeight={200}
        cols={6}
      >
        <div key="clock" className="widget">
          <Clock date={date} />
        </div>
        <div key="weather" className="widget">
          <Weather />
        </div>
        <div key="citibike" className="widget">
          <Citibike />
        </div>
        <div key="calendar" className="widget">
          <Calendar />
        </div>
        <div key="subway" className="widget">
          <Subway />
        </div>
        <div key="chores" className="widget">
          <Chores date={date} />
        </div>
        <div key="status" className="widget">
          <Status date={date} />
        </div>
        {/* {error}
        <div id="main">
          {mainContent}
        </div> */}
      </ReactGridLayout>
    )
  }

}

export default connect(state => state.app)(mouseTrap(App))
