import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'

import * as IICOActions from '../../../../actions/iico'
import {
  SubmitBidForm,
  getSubmitBidFormIsInvalid,
  submitSubmitBidForm
} from '../submit-bid-form'
import StatRow from '../../../../components/stat-row'
import StatBlock from '../../../../components/stat-block'
import Button from '../../../../components/button'

import './bids.css'

class Bids extends PureComponent {
  static propTypes = {
    // State
    address: PropTypes.string.isRequired,
    data: PropTypes.shape({
      // Token
      tokenContractAddress: PropTypes.string.isRequired,
      tokensForSale: PropTypes.number.isRequired,

      // Times
      startTime: PropTypes.instanceOf(Date).isRequired,
      endFullBonusTime: PropTypes.instanceOf(Date).isRequired,
      withdrawalLockTime: PropTypes.instanceOf(Date).isRequired,
      endTime: PropTypes.instanceOf(Date).isRequired,

      // Sale Data
      startingBonus: PropTypes.number.isRequired,
      bonus: PropTypes.number.isRequired,
      valuation: PropTypes.number.isRequired,
      amountCommitted: PropTypes.number.isRequired,
      virtualValuation: PropTypes.number.isRequired
    }).isRequired,
    bids: PropTypes.arrayOf(
      PropTypes.shape({
        maxVal: PropTypes.number.isRequired,
        contrib: PropTypes.number.isRequired,
        bonus: PropTypes.number.isRequired,
        contributor: PropTypes.string.isRequired,
        withdrawn: PropTypes.bool.isRequired,
        redeemed: PropTypes.bool.isRequired
      }).isRequired
    ).isRequired,

    // Action Dispatchers
    createIICOBid: PropTypes.func.isRequired,
    withdrawIICOBid: PropTypes.func.isRequired,

    // submitBidForm
    submitBidFormIsInvalid: PropTypes.bool.isRequired,
    submitSubmitBidForm: PropTypes.func.isRequired
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

    toastr.confirm(
      `Are you sure you wish to withdraw this bid? ${lockedIn} ETH would remain locked in and your new bonus would be ${newBonus}.`,
      { onOk: () => withdrawIICOBid(address, id) }
    )
  }

  render() {
    const {
      data,
      bids,
      submitBidFormIsInvalid,
      submitSubmitBidForm
    } = this.props

    const now = Date.now()
    const hasStarted = now >= data.startTime.getTime()
    const canBid = hasStarted && now < data.endTime.getTime()
    const canWithdraw = hasStarted && now < data.withdrawalLockTime.getTime()

    console.log(bids)
    return (
      <div className="Bids">
        <h1>Your Bids</h1>
        {canBid && (
          <StatRow>
            <StatBlock
              value={
                <SubmitBidForm
                  onSubmit={this.handleSubmitBidFormSubmit}
                  className="Bids-submitBidForm"
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
        {bids.length
          ? bids.map((b, index) => {
              const tokenPrice =
                data.virtualValuation / (data.tokensForSale * (1 + b.bonus))

              return (
                <StatRow key={index}>
                  <StatBlock label="Contribution" value={b.contrib} />
                  <StatBlock
                    label="Bonus"
                    value={`${(b.bonus * 100).toFixed(2)}%`}
                  />
                  <StatBlock label="Personal Cap" value={b.maxVal} />
                  <StatBlock label="Tokens" value={b.contrib / tokenPrice} />
                  <StatBlock
                    label="Token Price"
                    value={tokenPrice.toFixed(2)}
                  />
                  {canWithdraw &&
                    !b.withdrawn && (
                      <StatBlock
                        value={
                          <Button onClick={this.handleWithdrawClick} id={index}>
                            WITHDRAW
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
    submitBidFormIsInvalid: getSubmitBidFormIsInvalid(state)
  }),
  {
    createIICOBid: IICOActions.createIICOBid,
    withdrawIICOBid: IICOActions.withdrawIICOBid,
    submitSubmitBidForm
  }
)(Bids)
