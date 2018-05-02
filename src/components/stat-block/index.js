import React from 'react'
import PropTypes from 'prop-types'

import './stat-block.css'

const StatBlock = ({
  id,
  label,
  value,
  tooltip,
  noBackground,
  noFlex,
  flexBasis
}) => (
  <div
    data-tip={tooltip}
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
    <div id={id} className="StatBlock-joyrideTarget" />
  </div>
)

StatBlock.propTypes = {
  // State
  id: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.node.isRequired,
  tooltip: PropTypes.string,

  // Modifiers
  noBackground: PropTypes.bool,
  noFlex: PropTypes.bool,
  flexBasis: PropTypes.number
}

StatBlock.defaultProps = {
  // State
  id: undefined,
  label: null,
  tooltip: undefined,

  // Modifiers
  noBackground: false,
  noFlex: false,
  flexBasis: null
}

export default StatBlock
