import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { RenderIf } from 'lessdux'

import * as IICOSelectors from '../../reducers/iico'
import * as IICOActions from '../../actions/iico'

import Data from './components/data'
import Bids from './components/bids'

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
    IICOBids: IICOSelectors.IICOBidsShape.isRequired,

    // Action Dispatchers
    fetchIICOData: PropTypes.func.isRequired,
    fetchIICOBids: PropTypes.func.isRequired
  }

  componentDidMount() {
    const {
      match: { params: { address } },
      fetchIICOData,
      fetchIICOBids
    } = this.props
    fetchIICOData(address)
    fetchIICOBids(address)
  }

  render() {
    const { match: { params: { address } }, IICOData, IICOBids } = this.props

    return (
      <div className="IICO">
        <div className="IICO-data">
          <RenderIf
            resource={IICOData}
            loading="Loading..."
            done={IICOData.data && <Data data={IICOData.data} />}
            failedLoading="The address or the contract it holds is invalid. Try another one."
          />
        </div>
        <div className="IICO-bids">
          <RenderIf
            resource={IICOBids}
            loading="Loading..."
            done={
              IICOBids.data && <Bids address={address} bids={IICOBids.data} />
            }
            failedLoading="There was an error fetching your bids."
          />
        </div>
        {/* TODO: Render './components/submit-bid-form' and disable submit button if already participated */}
        {/* TODO: Render withdraw button if already participated and in first period */}
      </div>
    )
  }
}

export default connect(
  state => ({
    IICOData: state.IICO.IICOData,
    IICOBids: state.IICO.IICOBids
  }),
  {
    fetchIICOData: IICOActions.fetchIICOData,
    fetchIICOBids: IICOActions.fetchIICOBids
  }
)(IICO)
