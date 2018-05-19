import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { RenderIf } from 'lessdux'

import * as IICOSelectors from '../../reducers/iico'
import * as IICOActions from '../../actions/iico'
import Identicon from '../../components/identicon'
import Button from '../../components/button'

import {
  IICOAddressForm,
  submitIICOAddressForm
} from './components/iico-address-form'

import './home.css'

class Home extends PureComponent {
  static propTypes = {
    // React Router
    history: PropTypes.shape({ replace: PropTypes.func.isRequired }).isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({ address: PropTypes.string }).isRequired
    }).isRequired,

    // Redux State
    IICOData: IICOSelectors.IICODataShape.isRequired,

    // Action Dispatchers
    clearIICOData: PropTypes.func.isRequired,
    fetchIICOData: PropTypes.func.isRequired,

    // IICOAddressForm
    submitIICOAddressForm: PropTypes.func.isRequired
  }

  componentDidMount() {
    const {
      match: { params: { address } },
      clearIICOData,
      fetchIICOData
    } = this.props
    clearIICOData()
    address && fetchIICOData(address)
  }

  componentDidUpdate(prevProps) {
    const {
      match: { params: { address: prevAddress } },
      IICOData: prevIICOData
    } = prevProps
    const {
      history,
      location,
      match: { params: { address } },
      IICOData,
      fetchIICOData
    } = this.props
    if (address && prevAddress !== address) fetchIICOData(address)
    if (
      location.pathname !== '/' &&
      IICOData.failedLoading &&
      prevIICOData.failedLoading !== IICOData.failedLoading
    )
      history.replace(`/`)
  }

  handleIICOAddressFormSubmit = formData => {
    const { history } = this.props
    history.replace(`/${formData.address}`)
  }

  handleKeyPress = event => {
    if (event.key === 'Enter') {
      event.preventDefault()
      const { submitIICOAddressForm } = this.props
      submitIICOAddressForm()
    }
  }

  render() {
    const { match: { params: { address } }, IICOData } = this.props

    return (
      <div className="Home" onKeyPress={this.handleKeyPress}>
        {process.env.REACT_APP_BRANCH !== 'master' && (
          <IICOAddressForm
            onSubmit={this.handleIICOAddressFormSubmit}
            initialValues={{ address }}
            className="Home-form"
          />
        )}
        <RenderIf
          resource={IICOData}
          loading="Loading contract..."
          done={
            IICOData.data && (
              <div className="Home-result">
                <Identicon seed={IICOData.data.address} />
                <h3 className="Home-result-title">
                  Go To Simple or Interactive IICO
                </h3>
                <div className="Home-result-options">
                  <div className="Home-result-options-option">
                    <h1>Simple</h1>
                    <p>
                      Use the simple interface if you just want to buy tokens in
                      a simple manner.
                    </p>
                    <Link to={`/simple/${IICOData.data.address}`}>
                      <Button>Go</Button>
                    </Link>
                  </div>
                  <div className="Home-result-options-option">
                    <h1>Interactive</h1>
                    <p>
                      Use the interactive interface if you want to place
                      sophisticated bids with personal caps on the amount
                      raised.
                    </p>
                    <Link to={`/interactive/${IICOData.data.address}`}>
                      <Button>Go</Button>
                    </Link>
                  </div>
                </div>
              </div>
            )
          }
          failedLoading={
            IICOData.data !== null &&
            'The address or the contract it holds is invalid. Try another one.'
          }
        />
      </div>
    )
  }
}

export default connect(
  state => ({
    IICOData: state.IICO.IICOData
  }),
  {
    clearIICOData: IICOActions.clearIICOData,
    fetchIICOData: IICOActions.fetchIICOData,
    submitIICOAddressForm
  }
)(Home)
