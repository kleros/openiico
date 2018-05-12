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
    // Redux State
    IICOData: IICOSelectors.IICODataShape.isRequired,

    // Action Dispatchers
    clearIICOData: PropTypes.func.isRequired,
    fetchIICOData: PropTypes.func.isRequired,

    // IICOAddressForm
    submitIICOAddressForm: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { clearIICOData } = this.props
    clearIICOData()
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
    const { IICOData } = this.props

    return (
      <div className="Home" onKeyPress={this.handleKeyPress}>
        <IICOAddressForm
          onSubmit={this.handleIICOAddressFormSubmit}
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
                  <Link to={`/:address${IICOData.data.address}`}>
                    Interactive
                  </Link>{' '}
                  IICO Page
                </h3>
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
