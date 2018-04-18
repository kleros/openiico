import React from 'react'
import PropTypes from 'prop-types'

import './stat-row.css'

const StatRow = ({ children, withBoxShadow }) => (
  <div className={`StatRow ${withBoxShadow ? 'StatRow--withBoxShadow' : ''}`}>
    <div className="StatRow-blocks">{children}</div>
  </div>
)

StatRow.propTypes = {
  // State
  children: PropTypes.arrayOf(PropTypes.element.isRequired).isRequired,

  // Modifiers
  withBoxShadow: PropTypes.bool
}

StatRow.defaultProps = {
  // Modifiers
  withBoxShadow: false
}

export default StatRow
