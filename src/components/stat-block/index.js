import React from 'react'
import PropTypes from 'prop-types'

import './stat-block.css'

const StatBlock = ({ label, value }) => (
  <div className={`StatBlock ${label ? '' : 'StatBlock--withNoLabel'}`}>
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
  value: PropTypes.string.isRequired
}

StatBlock.defaultProps = {
  // State
  label: null
}

export default StatBlock
