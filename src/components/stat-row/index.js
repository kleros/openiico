import React from 'react'
import PropTypes from 'prop-types'

import './stat-row.css'

const StatRow = ({ id, children, withBoxShadow }) => (
  <div className={`StatRow ${withBoxShadow ? 'StatRow--withBoxShadow' : ''}`}>
    <div className="StatRow-blocks">{children}</div>
    <div id={id} className="StatRow-joyrideTarget" />
  </div>
)

StatRow.propTypes = {
  // State
  id: PropTypes.string,
  children: PropTypes.node.isRequired,

  // Modifiers
  withBoxShadow: PropTypes.bool
}

StatRow.defaultProps = {
  // State
  id: undefined,

  // Modifiers
  withBoxShadow: false
}

export default StatRow
