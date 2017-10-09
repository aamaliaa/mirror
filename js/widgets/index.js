import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

class AbstractWidget extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isActive: false,
      hasError: false,
    }
  }

  renderContent() {
    console.warn("A Widget has not implemented the renderContent method")
    return null
  }

  renderActive() {
    console.warn("A Widget has not implemented the renderActive method")
    return null
  }

  getWidgetClassNames() {
    const widgetClassName = `widget-${this.constructor.name.toLowerCase()}`
    const classNames = [
      'widget',
      widgetClassName,
      this.props.className,
    ]

    if (this.state.isActive) classNames.push('widget-active')

    return classNames
  }

  render() {
    let content
    if (this.state.isActive) {
      content = this.renderActive()
    } else {
      content = this.renderContent()
    }

    return (
      <section className={cx(this.getWidgetClassNames())}>
        {content}
      </section>
    )
  }
}

AbstractWidget.propTypes = {
  className: PropTypes.string,
}

export default AbstractWidget
