import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { Provider, connect } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { Switch, Route } from 'react-router-dom'

import NavBar from '../components/nav-bar'
import Home from '../containers/home'
import SimpleBid from '../containers/simple-bid'
import IICO from '../containers/iico'
import PageNotFound from '../containers/page-not-found'

import Initializer from './initializer'
import GlobalComponents from './global-components'
import { ETHAddressRegExpCaptureGroup, ETHAddressRegExp } from './dapp-api'

import './app.css'

const toWithAddress = base => location =>
  `${base}/${location.pathname.match(ETHAddressRegExp)[0]}`
const hasNonRootAddress = location =>
  location.pathname.slice(0, 3) !== '/0x' &&
  location.pathname.slice(0, 4) !== '/404' &&
  ETHAddressRegExp.test(location.pathname)
const ConnectedNavBar = connect(state => ({
  accounts: state.wallet.accounts,
  balance: state.wallet.balance
}))(({ location, accounts, balance }) => (
  <NavBar
    location={location}
    accounts={accounts}
    balance={balance}
    routes={[
      {
        name: 'Home',
        to: '/',
        visible: location => location.pathname.slice(0, 4) === '/404'
      },
      {
        name: 'Simple',
        to: toWithAddress('/simple'),
        visible: hasNonRootAddress
      },
      {
        name: 'Interactive',
        to: toWithAddress('/interactive'),
        visible: hasNonRootAddress
      },
      {
        name: 'Terms & Conditions',
        to: 'https://kleros.io/assets/token-sale-tos.pdf',
        isExternal: true
      }
    ]}
  />
))

const App = ({ store, history, testElement }) => (
  <Provider store={store}>
    <Initializer>
      <ConnectedRouter history={history}>
        <div id="router-root">
          <Helmet>
            <title>Open IICO</title>
          </Helmet>
          <Route exact path="*" component={ConnectedNavBar} />
          <Switch>
            <Route
              exact
              path={`/:address${ETHAddressRegExpCaptureGroup}?`}
              component={Home}
            />
            <Route
              exact
              path={`/simple/:address${ETHAddressRegExpCaptureGroup}`}
              component={SimpleBid}
            />
            <Route
              exact
              path={`/interactive/:address${ETHAddressRegExpCaptureGroup}`}
              component={IICO}
            />
            <Route
              exact
              path={`/(404|.*)/:address${ETHAddressRegExpCaptureGroup}?`}
              component={PageNotFound}
            />
          </Switch>
          {testElement}
          <Route exact path="*" component={GlobalComponents} />
        </div>
      </ConnectedRouter>
    </Initializer>
  </Provider>
)

App.propTypes = {
  // State
  store: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,

  // Testing
  testElement: PropTypes.element
}

App.defaultProps = {
  // Testing
  testElement: null
}

export default App
