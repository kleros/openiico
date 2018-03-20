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
    fetchIICOData: PropTypes.func.isRequired,

    // IICOAddressForm
    submitIICOAddressForm: PropTypes.func.isRequired
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
        <IICOAddressForm onSubmit={this.handleIICOAddressFormSubmit} />
        <div className="Home-result">
          <RenderIf
            resource={IICOData}
            loading="Loading..."
            done={
              IICOData.data && (
                <div>
                  <Identicon seed={IICOData.data.address} size={60} />
                  <h2 className="Home-result-link">
                    <Link to={`/${IICOData.data.address}`}>
                      Go To IICO Page
                    </Link>
                  </h2>
                </div>
              )
            }
            failedLoading={
              IICOData.data !== null &&
              'The address or the contract it holds is invalid. Try another one.'
            }
          />
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({
    IICOData: state.IICO.IICOData
  }),
  {
    fetchIICOData: IICOActions.fetchIICOData,
    submitIICOAddressForm
  }
)(Home)
