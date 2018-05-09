import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { RenderIf } from 'lessdux'

import * as walletSelectors from '../reducers/wallet'
import * as walletActions from '../actions/wallet'
import RequiresMetaMask from '../components/requires-meta-mask'

import { eth } from './dapp-api'

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

  state = { isWeb3Loaded: eth.accounts !== undefined }

  componentDidMount() {
    const { fetchAccounts } = this.props
    fetchAccounts()
  }

  componentDidUpdate(prevProps) {
    const { accounts: prevAccounts } = prevProps
    const { accounts, fetchBalance } = this.props
    if (accounts.data && accounts.data[0] && prevAccounts !== accounts)
      fetchBalance()
  }

  render() {
    const { isWeb3Loaded } = this.state
    const { accounts, children } = this.props

    let address = window.location.pathname.slice(1)
    address = /0x[a-fA-F0-9]{40}/.test(address) && address

    return (
      <RenderIf
        resource={accounts}
        loading="Loading Web3..."
        done={children}
        failedLoading={
          <div>
            <RequiresMetaMask needsUnlock={isWeb3Loaded} />
            {address && (
              <div id="initializer-message">
                If you don't know what MetaMask or a Web3 enabled browser is and
                you don't care about setting a personal cap on the valuation for
                your bid. In other words, you just want to buy some tokens no
                matter what.
                <br />
                <br />
                You can use any wallet software to send ETH directly to the
                contract address:
                <br />
                <br />
                {address}
                <br />
                <br />
                Later, when the sale is over, you can do the same, but send 0
                ETH to redeem all your bids.
                <br />
                <br />
                Otherwise, to look at contract data and place more sophisticated
                bids, please come back with Web3 enabled.
              </div>
            )}
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
