import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { RenderIf } from 'lessdux'
import { getChecksumAddress } from 'ethjs-account'

import * as walletSelectors from '../reducers/wallet'
import * as walletActions from '../actions/wallet'
import RequiresMetaMask from '../components/requires-meta-mask'
import Identicon from '../components/identicon'
import ETHQR from '../components/eth-qr'

import { eth, ETHAddressRegExp } from './dapp-api'

import './initializer.css'

class Initializer extends PureComponent {
  static propTypes = {
    // Redux State
    accounts: walletSelectors.accountsShape.isRequired,

    // Action Dispatchers
    fetchAccounts: PropTypes.func.isRequired,
    fetchBalance: PropTypes.func.isRequired,

    // State
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element.isRequired)
    ]).isRequired
  }

  static getPathChecksummedAddress() {
    // Get possible address from path
    const address = window.location.pathname.slice(1)

    // Check if it's an address
    if (ETHAddressRegExp.test(address)) {
      const checksumAddress = getChecksumAddress(address)

      // Is it checksummed?
      if (address === checksumAddress)
        return address // Yes, return it
      else window.location.replace(`/${checksumAddress}`) // No, replace it
    }

    return null // Not an address
  }

  state = {
    isWeb3Loaded: eth.accounts !== undefined,
    pathAddress: Initializer.getPathChecksummedAddress()
  }

  componentDidMount() {
    const { fetchAccounts } = this.props
    fetchAccounts()
  }

  componentDidUpdate(prevProps) {
    const { accounts: prevAccounts } = prevProps
    const { accounts, fetchBalance } = this.props
    if (accounts.data && accounts.data[0] && prevAccounts !== accounts)
      fetchBalance()

    this.setState({ pathAddress: Initializer.getPathChecksummedAddress() })
  }

  render() {
    const { isWeb3Loaded, pathAddress } = this.state
    const { accounts, children } = this.props

    return (
      <RenderIf
        resource={accounts}
        loading="Loading Web3..."
        done={children}
        failedLoading={
          <div className="Initializer">
            <RequiresMetaMask needsUnlock={isWeb3Loaded} />
            {
              <div className="Initializer-message">
                <p>
                  In order to access the advanced functionalities of the
                  Interactive Coin Offering, you need a Web3 enabled browser
                  (like MetaMask or Parity).
                </p>
                <p>
                  If you don't care about setting a personal cap on the
                  valuation for your bid, you can use any wallet software to
                  send ETH directly to the contract address.
                </p>
                {pathAddress && (
                  <div className="Initializer-message-addressInfo">
                    <b>Contract Address:</b> {pathAddress}
                    <div className="Initializer-message-addressInfo-blocks">
                      <div>
                        <b>Identicon:</b>
                        <br />
                        <br />
                        <Identicon seed={pathAddress} size={50} />
                      </div>
                      <div>
                        <b>Transaction QR Code:</b>
                        <br />
                        <br />
                        <ETHQR to={pathAddress} />
                      </div>
                    </div>
                  </div>
                )}
                <p>
                  At the end of the sale, you will just need to send a 0 ETH
                  transaction to the same contract in order to get your Tokens.
                </p>
                <p>
                  Otherwise, to look at contract data and place advanced bids,
                  you can come back with a Web3 enabled browser.
                </p>
              </div>
            }
          </div>
        }
        extraValues={[accounts.data && accounts.data[0]]}
        extraFailedValues={[!isWeb3Loaded]}
      />
    )
  }
}

export default connect(
  state => ({
    accounts: state.wallet.accounts
  }),
  {
    fetchAccounts: walletActions.fetchAccounts,
    fetchBalance: walletActions.fetchBalance
  }
)(Initializer)
