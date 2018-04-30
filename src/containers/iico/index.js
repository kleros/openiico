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

  state = {
    hasSeenTutorial: false,
    inTutorial: false,
    tutorialNow: null,
    tutorialIICOData: null,
    tutorialIICOBids: null
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

  componentDidUpdate() {
    const { IICOData, IICOBids } = this.props
    const { hasSeenTutorial } = this.state

    if (IICOData.data && IICOBids.data && !hasSeenTutorial) {
      const tutorialIICOData = JSON.parse(JSON.stringify(IICOData))
      const tutorialIICOBids = JSON.parse(JSON.stringify(IICOBids))
      const startTime = IICOData.data.startTime.getTime()
      this.setState(
        {
          hasSeenTutorial: true,
          inTutorial: true,
          tutorialNow: startTime - 1000,
          tutorialIICOData: {
            ...tutorialIICOData,
            data: {
              ...tutorialIICOData.data,
              startTime: new Date(startTime),
              endFullBonusTime: new Date(
                IICOData.data.endFullBonusTime.getTime()
              ),
              withdrawalLockTime: new Date(
                IICOData.data.withdrawalLockTime.getTime()
              ),
              endTime: new Date(IICOData.data.endTime.getTime())
            }
          },
          tutorialIICOBids
        },
        () => this.joyrideRef.reset(true)
      )
    }
  }

  componentWillUnmount() {
    clearInterval(this.pollIICODataInterval)
  }

  getJoyrideRef = ref => (this.joyrideRef = ref)

  joyrideCallback = ({ type, step }) => {
    const { tutorialIICOData } = this.state

    switch (type) {
      case 'step:after':
        switch (step.selector.slice('#joyride'.length)) {
          case 'Slider':
            this.setState({
              tutorialNow: tutorialIICOData.data.startTime.getTime()
            })
            break
          default:
            break
        }
        break
      case 'finished':
        this.setState({
          inTutorial: false,
          tutorialNow: null,
          tutorialIICOData: null,
          tutorialIICOBids: null
        })
        break
      default:
        break
    }
  }

  render() {
    const { match } = this.props
    const {
      inTutorial,
      tutorialNow,
      tutorialIICOData,
      tutorialIICOBids
    } = this.state
    const { match: { params: { address } }, IICOData, IICOBids } = inTutorial
      ? { match, IICOData: tutorialIICOData, IICOBids: tutorialIICOBids }
      : this.props

    return (
      <div className="IICO">
        <Joyride getRef={this.getJoyrideRef} callback={this.joyrideCallback} />
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
                  <Data data={IICOData.data} tutorialNow={tutorialNow} />
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
                          tutorialNow={tutorialNow}
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
