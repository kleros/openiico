import React from 'react'
import PropTypes from 'prop-types'

import './circle.css'

const Circle = ({ size, color }) => (
  <div
    className="Circle"
    style={{ background: color, height: size, width: size }}
  />
)

Circle.propTypes = {
  // State
  size: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired
}

export default Circle
