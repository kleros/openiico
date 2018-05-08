import React from 'react'
import PropTypes from 'prop-types'

import './chain-number.css'

const ChainNumber = ({ children }) => {
  const n = children.toFixed(2)
  return (
    <span data-tip={children} className="ChainNumber">
      {n.length > 5 ? `${n.slice(0, 5)}...` : n}
    </span>
  )
}

ChainNumber.propTypes = {
  // State
  children: PropTypes.number.isRequired
}

export default ChainNumber
