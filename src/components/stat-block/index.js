import React from 'react'
import PropTypes from 'prop-types'

import './stat-block.css'

const StatBlock = ({ label, value, noBackground }) => (
  <div
    className={`StatBlock ${
      label || noBackground ? '' : 'StatBlock--withNoLabel'
    }`}
  >
    {label && <h2>{label}:</h2>}
    <h3
      className={`StatBlock-value ${
        label ? '' : 'StatBlock-value--withNoLabel'
      }`}
    >
      {value}
    </h3>
  </div>
)

StatBlock.propTypes = {
  // State
  label: PropTypes.string,
  value: PropTypes.node.isRequired,

  // Modifiers
  noBackground: PropTypes.bool
}

StatBlock.defaultProps = {
  // State
  label: null,

  // Modifiers
  noBackground: false
}

export default StatBlock
