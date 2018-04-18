import React from 'react'
import PropTypes from 'prop-types'

const ChainHash = ({ children }) => (
  <span data-tip={children}>
    <a
      href={`https://etherscan.io/address/${children}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children.slice(0, 6) + '...' + children.slice(children.length - 4)}
    </a>
  </span>
)

ChainHash.propTypes = {
  // State
  children: PropTypes.string.isRequired
}

export default ChainHash
