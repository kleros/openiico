import React from 'react'
import PropTypes from 'prop-types'

import Identicon from '../../components/identicon'
import ETHQR from '../../components/eth-qr'

import './simple-bid.css'

const SimpleBid = ({ match: { params: { address } }, noWeb3 }) => (
  <div className="SimpleBid">
    {noWeb3 && (
      <p>
        In order to access the advanced functionalities of the Interactive Coin
        Offering, you need a Web3 enabled browser (like MetaMask or Parity).
      </p>
    )}
    <p>
      If you don't care about setting a personal cap on the valuation for your
      bid, you can use any wallet software to send ETH directly to the contract
      address. This is equivalent to submitting a bid with the "No Personal Cap"
      checkbox checked on the interactive interface.
    </p>
    {address && (
      <div className="SimpleBid-addressInfo">
        <b>Contract Address:</b> {address}
        <div className="SimpleBid-addressInfo-blocks">
          <div>
            <b>Identicon:</b>
            <br />
            <br />
            <Identicon seed={address} size={50} />
          </div>
          <div>
            <b>Transaction QR Code:</b>
            <br />
            <br />
            <ETHQR to={address} />
          </div>
        </div>
      </div>
    )}
    <p>
      At the end of the sale, you will just need to send a 0 ETH transaction to
      the same contract in order to get your Tokens.
    </p>
    {noWeb3 && (
      <p>
        Otherwise, to look at contract data and place advanced bids, you can
        come back with a Web3 enabled browser.
      </p>
    )}
  </div>
)

SimpleBid.propTypes = {
  // React Router
  match: PropTypes.shape({
    params: PropTypes.shape({ address: PropTypes.string }).isRequired
  }).isRequired,

  // State
  noWeb3: PropTypes.bool
}

SimpleBid.defaultProps = {
  // State
  noWeb3: false
}

export default SimpleBid
