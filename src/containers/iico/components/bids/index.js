import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import './bids.css'

class Bids extends PureComponent {
  static propTypes = {
    bids: PropTypes.arrayOf(
      PropTypes.shape({
        maxVal: PropTypes.number.isRequired,
        contrib: PropTypes.number.isRequired,
        bonus: PropTypes.number.isRequired,
        contributor: PropTypes.string.isRequired,
        withdrawn: PropTypes.bool.isRequired,
        redeemed: PropTypes.bool.isRequired
      }).isRequired
    )
  }

  render() {
    const { bids } = this.props

    console.log(bids)
    return (
      <div className="Bids">
        <h1>Your Bids</h1>
      </div>
    )
  }
}

export default Bids
