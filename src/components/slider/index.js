import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import './slider.css'

class Slider extends PureComponent {
  static propTypes = {
    // State
    startLabel: PropTypes.string.isRequired,
    endLabel: PropTypes.string.isRequired,
    initialPercent: PropTypes.number.isRequired,

    // Handlers
    calcValue: PropTypes.func.isRequired
  }

  state = {
    left: 0,
    value: null
  }

  barRef = null

  getBarRef = ref => {
    const { initialPercent, calcValue } = this.props

    this.barRef = ref

    /* istanbul ignore if  */
    if (process.env.NODE_ENV !== 'test')
      this.setState({
        left: this.barRef.getBoundingClientRect().width * initialPercent,
        value: calcValue(initialPercent)
      })
  }

  handleBarMouseMove = event => {
    const { calcValue } = this.props

    const boundingClientRect = this.barRef.getBoundingClientRect()
    const left = event.pageX - boundingClientRect.left
    const percent = left / boundingClientRect.width
    this.setState({
      left,
      value: calcValue(percent)
    })
  }

  render() {
    const { startLabel, endLabel } = this.props
    const { left, value } = this.state
    return (
      <div className="Slider">
        <div
          ref={this.getBarRef}
          className="Slider-bar"
          onMouseMove={this.handleBarMouseMove}
        />
        <div className="Slider-thumb" style={{ left }} />
        {value && (
          <div className="Slider-value" style={{ left }}>
            <h4>{value}</h4>
          </div>
        )}
        <div className="Slider-labels">
          <p>{startLabel}</p>
          <p>{endLabel}</p>
        </div>
      </div>
    )
  }
}

export default Slider
