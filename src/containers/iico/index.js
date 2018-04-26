import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { RenderIf } from 'lessdux'
import { ScaleLoader, PropagateLoader } from 'react-spinners'

import * as IICOSelectors from '../../reducers/iico'
import * as IICOActions from '../../actions/iico'

import Data from './components/data'
import Bids from './components/bids'
import Joyride from './components/joyride'

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
    pollIICOData: PropTypes.func.isRequired,
    fetchIICOBids: PropTypes.func.isRequired
  }

  pollIICODataInterval = null
  joyrideRef = null

  componentDidMount() {
    const {
      match: { params: { address } },
      fetchIICOData,
      pollIICOData,
      fetchIICOBids
    } = this.props
    fetchIICOData(address)
    fetchIICOBids(address)

    this.pollIICODataInterval = setInterval(() => pollIICOData(address), 5000)
  }

  componentWillUnmount() {
    clearInterval(this.pollIICODataInterval)
  }

  getJoyrideRef = ref => (this.joyrideRef = ref)

  render() {
    const { match: { params: { address } }, IICOData, IICOBids } = this.props

    return (
      <div className="IICO">
        <Joyride getRef={this.getJoyrideRef}>
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
        </Joyride>
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
    pollIICOData: IICOActions.pollIICOData,
    fetchIICOBids: IICOActions.fetchIICOBids
  }
)(IICO)
