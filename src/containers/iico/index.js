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
              endTime: new Date(IICOData.data.endTime.getTime()),
              bonus: IICOData.data.startingBonus
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
          case 'PlacedBid': {
            const endFullBonusTime = tutorialIICOData.data.endFullBonusTime.getTime()
            const endTime = tutorialIICOData.data.endTime.getTime()
            const tutorialNow =
              endFullBonusTime +
              (tutorialIICOData.data.withdrawalLockTime.getTime() -
                endFullBonusTime) /
                2
            this.setState({
              tutorialNow,
              bonus:
                tutorialIICOData.data.bonus *
                ((endTime - tutorialNow) / (endTime - endFullBonusTime))
            })
            break
          }
          case 'Withdrew':
            this.setState({
              tutorialNow: tutorialIICOData.data.endTime.getTime(),
              bonus: 0
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

  tutorialFinalizeIICOData = callback => {
    const { tutorialIICOData } = this.state

    this.setState(
      {
        tutorialIICOData: {
          ...tutorialIICOData,
          data: {
            ...tutorialIICOData.data,
            finalized: true
          }
        }
      },
      callback
    )
  }

  tutorialEditIICOBids = (IICOBidOrID, callback, lockedIn, newBonus) => {
    const { tutorialIICOData, tutorialIICOBids } = this.state

    let newBids
    if (typeof IICOBidOrID === 'number')
      newBids = tutorialIICOBids.data.map(
        b =>
          b.ID === IICOBidOrID
            ? lockedIn
              ? { ...b, contrib: lockedIn, bonus: newBonus, withdrawn: true }
              : { ...b, redeemed: true }
            : b
      )
    else newBids = [...tutorialIICOBids.data, IICOBidOrID]
    console.log(newBids)
    // Calculate new tutorial IICO Data
    const bids = [...newBids].sort((a, b) => {
      if (b.maxVal === a.maxVal) return b.ID - a.ID
      return b.maxVal - a.maxVal
    })
    let cutOffBidContrib
    let cutOffBid = bids[bids.length - 1]
    let valuation = 0
    let virtualValuation = 0
    for (const bid of bids) {
      if (bid.contrib + valuation < bid.maxVal) {
        // We haven't found the cut-off yet.
        cutOffBidContrib = bid.contrib
        cutOffBid = bid
        valuation += bid.contrib
        virtualValuation += bid.contrib + bid.contrib * (1 + bid.bonus)
      } else {
        // We found the cut-off bid. This bid will be taken partially.
        cutOffBidContrib = bid.maxVal >= valuation ? bid.maxVal - valuation : 0 // The amount of the contribution of the cut-off bid that can stay in the sale without spilling over the maxVal.
        cutOffBid = bid
        valuation += cutOffBidContrib
        virtualValuation +=
          cutOffBidContrib + cutOffBidContrib * (1 + bid.bonus)
        break
      }
    }

    // Set new tutorial state
    this.setState(
      {
        tutorialIICOData: {
          ...tutorialIICOData,
          data: {
            ...tutorialIICOData.data,
            valuation,
            virtualValuation,
            cutOffBidID: cutOffBid.ID,
            cutOffBidMaxVal: cutOffBid.maxVal,
            cutOffBidContrib
          }
        },
        tutorialIICOBids: {
          ...tutorialIICOBids,
          data: newBids
        }
      },
      callback
    )
  }

  tutorialNext = () => this.joyrideRef.next()

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
                <div id="joyrideFinish" className="IICO-data">
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
                          tutorialFinalizeIICOData={
                            this.tutorialFinalizeIICOData
                          }
                          tutorialEditIICOBids={this.tutorialEditIICOBids}
                          tutorialNext={this.tutorialNext}
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
