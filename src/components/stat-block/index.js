import React from 'react'
import PropTypes from 'prop-types'

import './stat-block.css'

const StatBlock = ({ label, value }) => (
  <div className="StatBlock">
    <h2>{label}:</h2>
    <h3>{value}</h3>
  </div>
)

StatBlock.propTypes = {
  // State
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
}

export default StatBlock
