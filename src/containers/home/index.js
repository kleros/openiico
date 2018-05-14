import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { RenderIf } from 'lessdux'

import * as IICOSelectors from '../../reducers/iico'
import * as IICOActions from '../../actions/iico'
import Identicon from '../../components/identicon'

import {
  IICOAddressForm,
  submitIICOAddressForm
} from './components/iico-address-form'

import './home.css'

class Home extends PureComponent {
  static propTypes = {
    // React Router
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
      submitIICOAddressForm
    } = this.props
    clearIICOData()
    address && submitIICOAddressForm()
  }

  handleIICOAddressFormSubmit = formData => {
    const { fetchIICOData } = this.props
    fetchIICOData(formData.address)
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
        <IICOAddressForm
          onSubmit={this.handleIICOAddressFormSubmit}
          initialValues={{ address }}
          className="Home-form"
        />
        <RenderIf
          resource={IICOData}
          loading="Loading contract..."
          done={
            IICOData.data && (
              <div className="Home-result">
                <Identicon seed={IICOData.data.address} size={60} />
                <h3 className="Home-result-link">
                  Go To{' '}
                  <Link to={`/simple/${IICOData.data.address}`}>Simple</Link> /{' '}
                  <Link to={`/interactive/${IICOData.data.address}`}>
                    Interactive
                  </Link>{' '}
                  IICO Page
                </h3>
                <p>
                  Use the simple interface if you just want to buy tokens in a
                  simple manner.
                </p>
                <p>
                  Use the interactive interface if you want to place
                  sophisticated bids with personal caps on the amount raised.
                </p>
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
