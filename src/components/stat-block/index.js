import React from 'react'
import PropTypes from 'prop-types'

import './stat-block.css'

const StatBlock = ({ label, value, noBackground, noFlex, flexBasis }) => (
  <div
    className={`StatBlock ${
      label || noBackground ? '' : 'StatBlock--withNoLabel'
    } ${noFlex ? 'StatBlock--noFlex' : ''}`}
    style={flexBasis && { flex: `0 1 ${flexBasis}px` }}
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
  noBackground: PropTypes.bool,
  noFlex: PropTypes.bool,
  flexBasis: PropTypes.number
}

StatBlock.defaultProps = {
  // State
  label: null,

  // Modifiers
  noBackground: false,
  noFlex: false,
  flexBasis: null
}

export default StatBlock
