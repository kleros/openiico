import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { Provider, connect } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { Switch, Route } from 'react-router-dom'

import NavBar from '../components/nav-bar'
import Home from '../containers/home'
import IICO from '../containers/iico'
import PageNotFound from '../components/page-not-found'

import Initializer from './initializer'
import GlobalComponents from './global-components'

import './app.css'

const ConnectedNavBar = connect(state => ({
  accounts: state.wallet.accounts,
  balance: state.wallet.balance
}))(({ accounts, balance }) => (
  <NavBar
    accounts={accounts}
    balance={balance}
    routes={[{ name: 'Home', to: '/' }]}
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
          <div id="scroll-root">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/:address" component={IICO} />
              <Route component={PageNotFound} />
            </Switch>
          </div>
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
  testElement: null
}

export default App
