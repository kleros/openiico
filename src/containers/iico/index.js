import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { RenderIf } from 'lessdux'
import { ScaleLoader, PropagateLoader } from 'react-spinners'

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
        <RenderIf
          resource={IICOData}
          loading={
            <ScaleLoader
              color="#9b9b9b"
              height={150}
              width={10}
              margin="10px"
              radius={10}
            />
          }
          done={
            IICOData.data && (
              <div>
                <div className="IICO-data">
                  <Data data={IICOData.data} />
                </div>
                <div className="IICO-bids">
                  <RenderIf
                    resource={IICOBids}
                    loading={<PropagateLoader color="#9b9b9b" size={20} />}
                    done={
                      IICOBids.data && (
                        <Bids
                          address={address}
                          data={IICOData.data}
                          bids={IICOBids.data}
                          updatingBids={IICOBids.updating}
                        />
                      )
                    }
                    failedLoading="There was an error fetching your bids."
                  />
                </div>
              </div>
            )
          }
          failedLoading="The address or the contract it holds is invalid. Try another one."
        />
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
