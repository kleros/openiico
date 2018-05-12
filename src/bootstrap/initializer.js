import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { RenderIf } from 'lessdux'
import { getChecksumAddress } from 'ethjs-account'

import * as walletSelectors from '../reducers/wallet'
import * as walletActions from '../actions/wallet'
import RequiresMetaMask from '../components/requires-meta-mask'
import SimpleBid from '../containers/simple-bid'

import { eth, ETHAddressRegExp } from './dapp-api'

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
    let address = window.location.pathname.match(ETHAddressRegExp)
    address = address && address[0]

    // There is an address
    if (address) {
      const checksumAddress = getChecksumAddress(address)

      // Is it checksummed?
      if (address === checksumAddress)
        return address // Yes, return it
      else
        window.location.replace(
          window.location.pathname.replace(address, checksumAddress)
        ) // No, replace it
    }

    return null // There is no address
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
          <div>
            <RequiresMetaMask needsUnlock={isWeb3Loaded} />
            <SimpleBid match={{ params: { address: pathAddress } }} />
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
