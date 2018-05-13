import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { RenderIf } from 'lessdux'

import * as walletSelectors from '../../reducers/wallet'
import Identicon from '../../components/identicon'
import logo from '../../assets/images/logo.png'

import './nav-bar.css'

const NavBar = ({ location, accounts, balance, routes }) => (
  <div className="NavBar">
    <img src={logo} alt="Logo" className="NavBar-logo" />
    <div className="NavBar-tabs">
      {routes.filter(r => !r.visible || r.visible(location)).map(r => {
        const to = typeof r.to === 'function' ? r.to(location) : r.to

        return r.isExternal ? (
          <a
            key={to}
            href={to}
            target="_blank"
            rel="noopener noreferrer"
            className="NavBar-tabs-tab"
          >
            {r.name}
          </a>
        ) : (
          <NavLink
            key={to}
            to={to}
            exact={to === '/'}
            activeClassName="is-active"
            className="NavBar-tabs-tab"
          >
            {r.name}
          </NavLink>
        )
      })}
    </div>
    <div className="NavBar-buttons">
      <div className="NavBar-buttons-button">
        <RenderIf
          resource={accounts}
          loading="..."
          done={accounts.data && <Identicon seed={accounts.data[0]} size={9} />}
          failedLoading="..."
        />
      </div>
      <div className="NavBar-buttons-balance">
        <RenderIf
          resource={balance}
          loading="..."
          done={
            <span data-tip="This is your current Web3 addresses' balance.">
              {balance.data} ETH
            </span>
          }
          failedLoading="..."
        />
      </div>
    </div>
  </div>
)

NavBar.propTypes = {
  // React Router
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }),

  // Redux State
  accounts: walletSelectors.accountsShape.isRequired,
  balance: walletSelectors.balanceShape.isRequired,

  // State
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      to: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
      isExternal: PropTypes.bool,
      visible: PropTypes.func
    }).isRequired
  ).isRequired
}

NavBar.defaultProps = {
  // React Router
  location: null
}

export default NavBar
