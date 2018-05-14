import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { RenderIf } from 'lessdux'
import { getChecksumAddress } from 'ethjs-account'
import { PropagateLoader } from 'react-spinners'

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

  state = {
    isWeb3Loaded: eth.accounts !== undefined,
    pathAddress: undefined
  }

  componentDidMount() {
    const { fetchAccounts } = this.props
    fetchAccounts()
    this.pathAddressCheck()
  }

  componentDidUpdate(prevProps) {
    const { accounts: prevAccounts } = prevProps
    const { accounts, fetchBalance } = this.props
    if (accounts.data && accounts.data[0] && prevAccounts !== accounts)
      fetchBalance()
  }

  pathAddressCheck = async () => {
    this.setState({ pathAddress: undefined })

    // Get possible address from path
    let address = window.location.pathname.match(ETHAddressRegExp)
    address = address && address[0]

    // There is an address
    if (address) {
      // Check that it has code
      try {
        const code = await eth.getCode(address)
        if (code === '0x') throw new Error()
      } catch (err) {
        console.error(err)
        return window.location.replace('/404')
      }

      // Is it checksummed?
      const checksumAddress = getChecksumAddress(address)
      if (address !== checksumAddress)
        return window.location.replace(
          window.location.pathname.replace(address, checksumAddress)
        ) // No, replace it
    }

    // Block all other sales for now to avoid phishing
    if (
      process.env.REACT_APP_BRANCH === 'master' &&
      address !== '0xac43300F2D0c345B716F36853eCeb497576E0F67'
    )
      return window.location.replace(
        '/0xac43300F2D0c345B716F36853eCeb497576E0F67'
      )

    this.setState({ pathAddress: address || null })
  }

  render() {
    const { isWeb3Loaded, pathAddress } = this.state
    const { accounts, children } = this.props

    const loading = (
      <div id="initializer-loader">
        <PropagateLoader color="#9b9b9b" size={20} />
      </div>
    )

    if (pathAddress === undefined) return loading

    return (
      <RenderIf
        resource={accounts}
        loading={loading}
        done={children}
        failedLoading={
          <div>
            <RequiresMetaMask needsUnlock={isWeb3Loaded} />
            <SimpleBid match={{ params: { address: pathAddress } }} noWeb3 />
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
