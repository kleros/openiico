import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'
import { SyncLoader } from 'react-spinners'

import * as IICOSelectors from '../../../../reducers/iico'
import * as IICOActions from '../../../../actions/iico'
import * as walletSelectors from '../../../../reducers/wallet'
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
    accounts: walletSelectors.accountsShape.isRequired,

    // Action Dispatchers
    createIICOBid: PropTypes.func.isRequired,
    withdrawIICOBid: PropTypes.func.isRequired,
    finalizeIICO: PropTypes.func.isRequired,
    redeemIICOBid: PropTypes.func.isRequired,
    redeemIICOBids: PropTypes.func.isRequired,

    // submitBidForm
    submitBidFormIsInvalid: PropTypes.bool.isRequired,
    submitSubmitBidForm: PropTypes.func.isRequired,

    // finalizeIICOForm
    finalizeIICOFormIsInvalid: PropTypes.bool.isRequired,
    submitFinalizeIICOForm: PropTypes.func.isRequired,

    // State
    address: PropTypes.string.isRequired,
    data: IICOSelectors._IICODataShape.isRequired,
    bids: IICOSelectors._IICOBidsShape.isRequired,
    updatingBids: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.arrayOf(PropTypes.number.isRequired)
    ]).isRequired,
    tutorialNow: PropTypes.number,
    tutorialFinalizeIICOData: PropTypes.func.isRequired,
    tutorialEditIICOBids: PropTypes.func.isRequired,
    tutorialNext: PropTypes.func.isRequired
  }

  static defaultProps = {
    tutorialNow: null
  }

  validateSubmitBidForm = values => {
    const { data, bids } = this.props
    const errors = {}

    // Check we are not exceeding the KYC max base contrib
    if (
      !data.inReinforcedWhitelist &&
      bids.reduce((acc, b) => b.contrib + acc, 0) + Number(values.amount) >
        data.maximumBaseContribution
    )
      errors.amount = 'Cannot exceed maximum base KYC contribution.'

    // Check we are not submitting a personal cap lower than the valuation after the withdrawal lockup
    if (
      Date.now() >= data.withdrawalLockTime.getTime() &&
      Number(values.personalCap) < data.valuation
    )
      errors.personalCap = 'Must be higher than valuation.'

    return errors
  }

  handleSubmitBidFormSubmit = ({
    amount: _amount,
    personalCap: _personalCap,
    noPersonalCap
  }) => {
    const {
      accounts,
      address,
      data,
      bids,
      createIICOBid,
      tutorialNow,
      tutorialEditIICOBids,
      tutorialNext
    } = this.props
    const amount = Number(_amount)
    const personalCap = Number(_personalCap)

    // Calculate max token price
    const bonusMultiplier = 1 + data.bonus

    const leftOverToBid = personalCap - (data.valuation + amount)

    // If `leftOverToBid` is positive, assume future bids will get the current bonus, if it's negative, assume bids we are removing have the current bonus. This overestimates the max token price in both cases.
    const overEstimatedVirtualValuation =
      data.virtualValuation + (amount + leftOverToBid) * bonusMultiplier

    const maxTokenPrice =
      amount /
      (data.tokensForSale *
        (amount * bonusMultiplier / overEstimatedVirtualValuation))

    toastr.confirm(null, {
      okText: 'Yes',
      onOk: () =>
        tutorialNow
          ? tutorialEditIICOBids(
              {
                ID: bids.length ? bids[bids.length - 1].ID + 1 : 0,
                maxValuation: personalCap,
                contrib: amount,
                bonus: data.bonus,
                contributor: accounts.data[0],
                withdrawn: false,
                redeemed: false
              },
              () => {
                if (bids.length === 0) tutorialNext()
              }
            )
          : createIICOBid(address, amount, personalCap, noPersonalCap),
      component: () => (
        <div className="Bids-confirm">
          Are you sure you wish to submit this bid?
          <br />
          {noPersonalCap ? (
            'You are not setting a personal cap.'
          ) : (
            <div>
              <ChainNumber>{maxTokenPrice}</ChainNumber> ETH
              <br />
              is the maximum price per token you would pay with your personal
              cap of
              <br />
              {personalCap} ETH.
            </div>
          )}
        </div>
      )
    })
  }

  handleWithdrawClick = ({ currentTarget: { id: _id } }) => {
    const {
      withdrawIICOBid,
      address,
      data,
      bids,
      tutorialNow,
      tutorialEditIICOBids,
      tutorialNext
    } = this.props
    const id = Number(_id)
    const now = tutorialNow || Date.now()
    const endFullBonusTime = data.endFullBonusTime.getTime()
    const withdrawalLockTime = data.withdrawalLockTime.getTime()
    const bid = bids.find(b => b.ID === id)

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
      onOk: () =>
        tutorialNow
          ? tutorialEditIICOBids(id, () => tutorialNext(), lockedIn, newBonus)
          : withdrawIICOBid(address, id),
      component: () => (
        <div className="Bids-confirm">
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
    const {
      address,
      finalizeIICO,
      tutorialNow,
      tutorialFinalizeIICOData,
      tutorialNext
    } = this.props
    if (tutorialNow) return tutorialFinalizeIICOData(tutorialNext)

    finalizeIICO(address, formData.maxIterations)
  }

  handleRedeemClick = ({ currentTarget: { id: _id } }) => {
    const {
      address,
      redeemIICOBid,
      tutorialNow,
      tutorialEditIICOBids,
      tutorialNext
    } = this.props
    const id = Number(_id)
    if (tutorialNow) return tutorialEditIICOBids(id, tutorialNext)

    redeemIICOBid(address, Number(id))
  }

  handleRedeemAllClick = () => {
    const { address, redeemIICOBids } = this.props

    redeemIICOBids(address)
  }

  render() {
    const {
      IICOBid,
      submitBidFormIsInvalid,
      submitSubmitBidForm,
      finalizeIICOFormIsInvalid,
      submitFinalizeIICOForm,
      data,
      bids,
      updatingBids,
      tutorialNow
    } = this.props

    const now = tutorialNow || Date.now()
    const hasStarted = now >= data.startTime.getTime()
    const hasEnded = now >= data.endTime.getTime()

    const canWithdraw = hasStarted && now < data.withdrawalLockTime.getTime()
    const canRedeem = hasEnded && data.finalized
    const inPartialWithdrawals = now > data.endFullBonusTime.getTime()

    const currentContribution = bids.reduce((acc, b) => b.contrib + acc, 0)

    let KYCLevelTooltip
    let KYCLevel
    if (data.inReinforcedWhitelist) {
      KYCLevelTooltip =
        "You have passed the Reinforced KYC and can contribute as much ETH as you'd like"
      KYCLevel = 'Reinforced'
    } else if (data.inBaseWhitelist) {
      KYCLevelTooltip = `You have passed the Base KYC and can contribute less than or equal to ${
        data.maximumBaseContribution
      } ETH.`
      KYCLevel = 'Base'
    } else {
      KYCLevelTooltip = 'You need to pass the KYC to participate in the sale.'
      KYCLevel = 'None'
    }

    return (
      <div id="joyridePlaceBid" className="Bids">
        <h1>Your Bids</h1>
        {!tutorialNow && (
          <StatRow>
            <StatBlock
              label="KYC Level"
              value={<span data-tip={KYCLevelTooltip}>{KYCLevel}</span>}
            />
            <StatBlock
              label="Maximum Base Contribution"
              value={data.maximumBaseContribution}
            />
            <StatBlock
              label="Your Current Contribution"
              value={<ChainNumber>{currentContribution}</ChainNumber>}
            />
          </StatRow>
        )}
        {hasStarted &&
          !hasEnded &&
          (tutorialNow ||
            data.inReinforcedWhitelist ||
            (data.inBaseWhitelist &&
              data.maximumBaseContribution > currentContribution)) && (
            <StatRow>
              <StatBlock
                value={
                  <SubmitBidForm
                    onSubmit={this.handleSubmitBidFormSubmit}
                    className="Bids-form"
                    validate={
                      tutorialNow ? undefined : this.validateSubmitBidForm
                    }
                  />
                }
              />
              <StatBlock
                value={
                  <Button
                    onClick={submitSubmitBidForm}
                    disabled={
                      submitBidFormIsInvalid ||
                      IICOBid.creating ||
                      (tutorialNow && bids.length > 0)
                    }
                  >
                    ADD
                  </Button>
                }
                noFlex
              />
            </StatRow>
          )}
        {canRedeem &&
          bids.some(b => !b.redeemed) && (
            <StatRow>
              <StatBlock
                value={
                  <Button
                    onClick={this.handleRedeemAllClick}
                    disabled={Boolean(tutorialNow)}
                  >
                    REDEEM ALL
                  </Button>
                }
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
                tooltip="The token sale is finalizing, refresh this page periodically until you see a redeem button."
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
                tooltip="The token sale is finalizing, refresh this page periodically until you see a redeem button."
                noFlex
              />
            </StatRow>
          )}
        {IICOBid.creating && (
          <StatRow>
            <StatBlock
              label="Contribution (ETH)"
              value={<SyncLoader color="#9b9b9b" size={8} />}
              tooltip="ETH that is currently part of the sale."
            />
            <StatBlock
              label="Personal Cap (ETH)"
              value={<SyncLoader color="#9b9b9b" size={8} />}
              tooltip="This bid's personal cap."
            />
            <StatBlock
              label="Bonus"
              value={<SyncLoader color="#9b9b9b" size={8} />}
              tooltip="This bid's bonus."
            />
            <StatBlock
              label="Token Price (ETH)"
              value={<SyncLoader color="#9b9b9b" size={8} />}
              tooltip="The price per token this bid got or would get if the sale were to end now."
            />
            <StatBlock
              label="Tokens"
              value={<SyncLoader color="#9b9b9b" size={8} />}
              tooltip="Tokens that can be redeemed or could be redeemed if the sale were to end now."
            />
            <StatBlock
              label="Refund (ETH)"
              value={<SyncLoader color="#9b9b9b" size={8} />}
              tooltip="ETH that can be redeemed or could be redeemed if the sale were to end now."
            />
          </StatRow>
        )}
        {bids.length ? (
          bids
            .map(b => {
              if (b.contrib === 0) return null

              // Assume bid is out of the sale
              let contrib = 0
              let refund = b.contrib
              if (b.ID === data.cutOffBidID) {
                // This is the cutoff bid
                contrib = data.cutOffBidContrib
                refund = b.contrib - data.cutOffBidContrib
              } else if (
                b.maxValuation > data.cutOffBidMaxValuation ||
                (b.maxValuation === data.cutOffBidMaxValuation &&
                  b.ID > data.cutOffBidID)
              ) {
                // This bid is in the sale
                contrib = b.contrib
                refund = 0
              }

              const tokens =
                contrib === 0
                  ? 0
                  : contrib *
                    (1 + b.bonus) /
                    data.virtualValuation *
                    data.tokensForSale

              const updating = updatingBids && updatingBids.includes(b.ID)

              return (
                <StatRow id="joyridePlacedBid" key={b.ID}>
                  <StatBlock
                    label="Contribution (ETH)"
                    value={<ChainNumber>{contrib}</ChainNumber>}
                    tooltip="ETH that is currently part of the sale."
                  />
                  <StatBlock
                    label="Personal Cap (ETH)"
                    value={
                      b.maxValuation >= 1.157920892373162e59
                        ? '∞'
                        : b.maxValuation
                    }
                    tooltip="This bid's personal cap."
                  />
                  <StatBlock
                    label="Bonus"
                    value={numberToPercentage(b.bonus)}
                    tooltip="This bid's bonus."
                  />
                  <StatBlock
                    label="Token Price (ETH)"
                    value={
                      <ChainNumber>
                        {tokens === 0 ? 0 : contrib / tokens}
                      </ChainNumber>
                    }
                    tooltip="The price per token this bid got or would get if the sale were to end now."
                  />
                  <StatBlock
                    label="Tokens"
                    value={<ChainNumber>{tokens}</ChainNumber>}
                    tooltip="Tokens that can be redeemed or could be redeemed if the sale were to end now."
                  />
                  <StatBlock
                    id="joyrideWithdrew"
                    label="Refund (ETH)"
                    value={<ChainNumber>{refund}</ChainNumber>}
                    tooltip="ETH that can be redeemed or could be redeemed if the sale were to end now."
                  />
                  {((canWithdraw && !b.withdrawn) ||
                    (canRedeem && !b.redeemed)) && (
                    <StatBlock
                      id="joyrideWithdraw"
                      value={
                        <Button
                          onClick={
                            canWithdraw
                              ? this.handleWithdrawClick
                              : this.handleRedeemClick
                          }
                          disabled={
                            IICOBid.updating ||
                            (tutorialNow && !inPartialWithdrawals)
                          }
                          id={b.ID}
                        >
                          {updating ? (
                            <SyncLoader color="#f2f5fa" size={10} />
                          ) : canWithdraw ? (
                            'WITHDRAW'
                          ) : (
                            'REDEEM'
                          )}
                        </Button>
                      }
                      noFlex
                    />
                  )}
                </StatRow>
              )
            })
            .reverse()
        ) : (
          <div>
            <br />You haven't made any bids.<br />
          </div>
        )}
      </div>
    )
  }
}

export default connect(
  state => ({
    IICOBid: state.IICO.IICOBid,
    accounts: state.wallet.accounts,
    submitBidFormIsInvalid: getSubmitBidFormIsInvalid(state),
    finalizeIICOFormIsInvalid: getFinalizeIICOFormIsInvalid(state)
  }),
  {
    createIICOBid: IICOActions.createIICOBid,
    withdrawIICOBid: IICOActions.withdrawIICOBid,
    finalizeIICO: IICOActions.finalizeIICOData,
    redeemIICOBid: IICOActions.redeemIICOBid,
    redeemIICOBids: IICOActions.redeemIICOBids,
    submitSubmitBidForm,
    submitFinalizeIICOForm
  }
)(Bids)
