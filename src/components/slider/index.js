import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import './slider.css'

class Slider extends PureComponent {
  static propTypes = {
    // State
    startLabel: PropTypes.string.isRequired,
    endLabel: PropTypes.string.isRequired,
    initialPercent: PropTypes.number.isRequired,
    steps: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        percent: PropTypes.number.isRequired
      }).isRequired
    ),

    // Callbacks
    calcValue: PropTypes.func.isRequired
  }

  static defaultProps = {
    steps: null
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
    if (this.barRef && process.env.NODE_ENV !== 'test')
      this.setState({
        left: this.barRef.getBoundingClientRect().width * initialPercent,
        value: calcValue(initialPercent)
      })
  }

  percentToPixel = percent => {
    if (!this.barRef) return 0
    return this.barRef.getBoundingClientRect().width * percent
  }

  handleBarMouseMove = event => {
    const { calcValue } = this.props

    const boundingClientRect = this.barRef.getBoundingClientRect()
    const left = event.pageX - boundingClientRect.left
    this.setState({
      left,
      value: calcValue(left / boundingClientRect.width)
    })
  }

  render() {
    const { startLabel, endLabel, steps } = this.props
    const { left, value } = this.state
    return (
      <div className="Slider">
        {/* Bar */}
        <div
          ref={this.getBarRef}
          onMouseMove={this.handleBarMouseMove}
          className="Slider-bar"
        />
        {/* Thumb */}
        <div className="Slider-thumb" style={{ left }} />
        {value && (
          <div className="Slider-value" style={{ left }}>
            <h4>{value}</h4>
          </div>
        )}
        {/* Steps */}
        {steps &&
          steps.map(s => (
            <div
              key={s.percent}
              onMouseMove={this.handleBarMouseMove}
              className="Slider-step"
              style={{ left: this.percentToPixel(s.percent) }}
            >
              <div className="Slider-step-label">
                <p>{s.label}</p>
              </div>
            </div>
          ))}
        {/* Labels */}
        <div className="Slider-labels">
          <p>{startLabel}</p>
          <p>{endLabel}</p>
        </div>
      </div>
    )
  }
}

export default Slider
