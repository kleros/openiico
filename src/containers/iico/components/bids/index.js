import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'

import * as IICOSelectors from '../../../../reducers/iico'
import * as IICOActions from '../../../../actions/iico'
import {
  SubmitBidForm,
  getSubmitBidFormIsInvalid,
  submitSubmitBidForm
} from '../submit-bid-form'
import {
  FinalizeIICOForm,
  getFinalizeIICOFormIsInvalid,
  submitFinalizeIICOForm
} from '../finalize-iico-form'
import ChainNumber from '../../../../components/chain-number'
import StatRow from '../../../../components/stat-row'
import StatBlock from '../../../../components/stat-block'
import Button from '../../../../components/button'
import { numberToPercentage } from '../../../../utils/number'

import './bids.css'

class Bids extends PureComponent {
  static propTypes = {
    // Redux State
    IICOBid: IICOSelectors.IICOBidShape.isRequired,

    // Action Dispatchers
    createIICOBid: PropTypes.func.isRequired,
    withdrawIICOBid: PropTypes.func.isRequired,
    finalizeIICO: PropTypes.func.isRequired,
    redeemIICOBid: PropTypes.func.isRequired,

    // submitBidForm
    submitBidFormIsInvalid: PropTypes.bool.isRequired,
    submitSubmitBidForm: PropTypes.func.isRequired,

    // finalizeIICOForm
    finalizeIICOFormIsInvalid: PropTypes.bool.isRequired,
    submitFinalizeIICOForm: PropTypes.func.isRequired,

    // State
    address: PropTypes.string.isRequired,
    data: IICOSelectors._IICODataShape.isRequired,
    bids: IICOSelectors._IICOBidsShape.isRequired
  }

  handleSubmitBidFormSubmit = formData => {
    const { address, createIICOBid } = this.props
    createIICOBid(address, formData.amount, formData.personalCap)
  }

  handleWithdrawClick = ({ currentTarget: { id } }) => {
    const { address, data, bids, withdrawIICOBid } = this.props

    const now = Date.now()
    const endFullBonusTime = data.endFullBonusTime.getTime()
    const withdrawalLockTime = data.withdrawalLockTime.getTime()
    const bid = bids[id]

    const lockedIn =
      now < endFullBonusTime
        ? 0
        : bid.contrib *
          (1 -
            (withdrawalLockTime - now) /
              (withdrawalLockTime - endFullBonusTime))
    const newBonus = bid.bonus - bid.bonus / 3

    toastr.confirm(null, {
      okText: 'Yes',
      onOk: () => withdrawIICOBid(address, Number(id)),
      component: () => (
        <div className="Bids-confirmWithdrawal">
          Are you sure you wish to withdraw this bid?
          <br />
          <ChainNumber>{lockedIn}</ChainNumber> ETH
          <br />
          would remain locked in and your new bonus would be
          <br />
          {numberToPercentage(newBonus)}.
        </div>
      )
    })
  }

  handleFinalizeIICOFormSubmit = formData => {
    const { address, finalizeIICO } = this.props
    finalizeIICO(address, formData.maxIterations)
  }

  handleRedeemClick = ({ currentTarget: { id } }) => {
    const { address, redeemIICOBid } = this.props
    redeemIICOBid(address, Number(id))
  }

  render() {
    const {
      IICOBid,
      submitBidFormIsInvalid,
      submitSubmitBidForm,
      finalizeIICOFormIsInvalid,
      submitFinalizeIICOForm,
      data,
      bids
    } = this.props

    const now = Date.now()
    const hasStarted = now >= data.startTime.getTime()
    const hasEnded = now >= data.endTime.getTime()
    const canBid = hasStarted && !hasEnded
    const canWithdraw = hasStarted && now < data.withdrawalLockTime.getTime()

    return (
      <div className="Bids">
        <h1>Your Bids</h1>
        {canBid && (
          <StatRow>
            <StatBlock
              value={
                <SubmitBidForm
                  onSubmit={this.handleSubmitBidFormSubmit}
                  className="Bids-form"
                />
              }
            />
            <StatBlock
              value={
                <Button
                  onClick={submitSubmitBidForm}
                  disabled={submitBidFormIsInvalid}
                >
                  ADD
                </Button>
              }
              noFlex
            />
          </StatRow>
        )}
        {!data.finalized &&
          hasEnded && (
            <StatRow>
              <StatBlock
                value={
                  <FinalizeIICOForm
                    onSubmit={this.handleFinalizeIICOFormSubmit}
                    className="Bids-form"
                  />
                }
              />
              <StatBlock
                value={
                  <Button
                    onClick={submitFinalizeIICOForm}
                    disabled={finalizeIICOFormIsInvalid}
                  >
                    FINALIZE
                  </Button>
                }
                noFlex
              />
            </StatRow>
          )}
        {bids.length
          ? bids.map((b, index) => {
              const tokenPrice =
                data.virtualValuation / (data.tokensForSale * (1 + b.bonus))

              const updating =
                IICOBid.updating &&
                IICOBid.data &&
                IICOBid.data.contributorBidID === index

              return (
                <StatRow key={index}>
                  <StatBlock
                    label="Contribution"
                    value={<ChainNumber>{b.contrib}</ChainNumber>}
                  />
                  <StatBlock
                    label="Bonus"
                    value={numberToPercentage(b.bonus)}
                  />
                  <StatBlock label="Personal Cap" value={b.maxVal} />
                  <StatBlock
                    label="Tokens"
                    value={<ChainNumber>{b.contrib / tokenPrice}</ChainNumber>}
                  />
                  <StatBlock
                    label="Token Price"
                    value={<ChainNumber>{tokenPrice}</ChainNumber>}
                  />
                  {((canWithdraw && !b.withdrawn) ||
                    (hasEnded && !b.redeemed)) && (
                    <StatBlock
                      value={
                        <Button
                          onClick={
                            canWithdraw
                              ? this.handleWithdrawClick
                              : this.handleRedeemClick
                          }
                          disabled={updating}
                          id={index}
                        >
                          {updating
                            ? '...'
                            : canWithdraw ? 'WITHDRAW' : 'REDEEM'}
                        </Button>
                      }
                      noFlex
                    />
                  )}
                </StatRow>
              )
            })
          : "You haven't made any bids."}
      </div>
    )
  }
}

export default connect(
  state => ({
    IICOBid: state.IICO.IICOBid,
    submitBidFormIsInvalid: getSubmitBidFormIsInvalid(state),
    finalizeIICOFormIsInvalid: getFinalizeIICOFormIsInvalid(state)
  }),
  {
    createIICOBid: IICOActions.createIICOBid,
    withdrawIICOBid: IICOActions.withdrawIICOBid,
    finalizeIICO: IICOActions.finalizeIICOData,
    redeemIICOBid: IICOActions.redeemIICOBid,
    submitSubmitBidForm,
    submitFinalizeIICOForm
  }
)(Bids)
