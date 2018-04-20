import React from 'react'
import PropTypes from 'prop-types'

import './chain-number.css'

const ChainNumber = ({ children }) => (
  <span data-tip={children} className="ChainNumber">
    {children.toFixed(2)}
  </span>
)

ChainNumber.propTypes = {
  // State
  children: PropTypes.number.isRequired
}

export default ChainNumber
