import React from 'react'
import PropTypes from 'prop-types'
import Blockies from 'react-blockies'

import './identicon.css'

const Identicon = ({ seed, size, scale, className, ...rest }) => {
  const length = `${size * scale}px`
  return (
    <div
      className={`Identicon ${className}`}
      style={{ height: length, width: length }}
    >
      <a
        href={`https://etherscan.io/address/${seed}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Blockies
          {...rest}
          seed={seed.toLowerCase()}
          size={size}
          scale={scale}
        />
      </a>
    </div>
  )
}

Identicon.propTypes = {
  // React Blockies
  seed: PropTypes.string.isRequired,
  size: PropTypes.number,
  scale: PropTypes.number,
  ...Blockies.propTypes,

  // Modifiers
  className: PropTypes.string
}

Identicon.defaultProps = {
  // React Blockies
  size: 8,
  scale: 16,

  // Modifiers
  className: ''
}

export default Identicon
