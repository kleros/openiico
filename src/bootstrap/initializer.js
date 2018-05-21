import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { RenderIf } from 'lessdux'
import { getChecksumAddress } from 'ethjs-account'
import { PropagateLoader } from 'react-spinners'

import * as walletSelectors from '../reducers/wallet'
import * as walletActions from '../actions/wallet'
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

  state = { pathAddress: undefined }

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
    // Get possible address from path
    let address = window.location.pathname.match(ETHAddressRegExp)
    address = address && address[0]

    // Block all other sales for now in the master branch to avoid phishing
    if (
      process.env.REACT_APP_BRANCH === 'master' &&
      (!address || address !== '0xac43300F2D0c345B716F36853eCeb497576E0F67')
    )
      return window.location.replace(
        '/0xac43300F2D0c345B716F36853eCeb497576E0F67'
      )

    if (!address) return this.setState({ pathAddress: null }) // No address, stop loading indicator

    // Check that it has code
    const checksumAddress = getChecksumAddress(address)
    const is404 = window.location.pathname.slice(0, 4) === '/404'
    try {
      const code = await eth.getCode(address)
      if (code === '0x') throw new Error()
      // Has code
      if (is404) return window.location.replace(`/${checksumAddress}`) // If in 404, we can go back to home
    } catch (err) {
      console.error(err)
      // No code
      if (!is404) return window.location.replace(`/404/${checksumAddress}`) // If not in 404, go
    }

    // It has code and we are not in 404 or it doesn't have code and we are in 404, is it checksummed?
    if (address !== checksumAddress)
      return window.location.replace(
        window.location.pathname.replace(address, checksumAddress)
      ) // No, replace it

    // All good, set address
    return this.setState({ pathAddress: address })
  }

  render() {
    const { accounts, children } = this.props
    const { pathAddress } = this.state

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
            <SimpleBid match={{ params: { address: pathAddress } }} noWeb3 />
          </div>
        }
        extraValues={[(accounts.data && accounts.data[0]) || null]}
        extraFailedValues={[!window.web3]}
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
