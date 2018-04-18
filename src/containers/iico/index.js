import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { RenderIf } from 'lessdux'

import * as IICOSelectors from '../../reducers/iico'
import * as IICOActions from '../../actions/iico'

import Info from './components/info'

import './iico.css'

class IICO extends PureComponent {
  static propTypes = {
    // React Router
    match: PropTypes.shape({
      params: PropTypes.shape({ address: PropTypes.string.isRequired })
        .isRequired
    }).isRequired,

    // Redux State
    IICOData: IICOSelectors.IICODataShape.isRequired,

    // Action Dispatchers
    fetchIICOData: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { match: { params: { address } }, fetchIICOData } = this.props
    fetchIICOData(address)
  }

  render() {
    const { IICOData } = this.props

    return (
      <div className="IICO">
        <div className="IICO-data">
          <RenderIf
            resource={IICOData}
            loading="Loading..."
            done={IICOData.data && <Info data={IICOData.data} />}
            failedLoading="The address or the contract it holds is invalid. Try another one."
          />
        </div>
        {/* TODO: Render './components/submit-bid-form' and disable submit button if already participated */}
        {/* TODO: Render './components/bid' if already participated */}
        {/* TODO: Render withdraw button if already participated and in first period */}
      </div>
    )
  }
}

export default connect(
  state => ({
    IICOData: state.IICO.IICOData
  }),
  {
    fetchIICOData: IICOActions.fetchIICOData
  }
)(IICO)
