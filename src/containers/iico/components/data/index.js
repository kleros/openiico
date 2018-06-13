import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import * as IICOSelectors from '../../../../reducers/iico'
import StatRow from '../../../../components/stat-row'
import StatBlock from '../../../../components/stat-block'
import ChainHash from '../../../../components/chain-hash'
import ChainNumber from '../../../../components/chain-number'
import Slider from '../../../../components/slider'
import { dateToString } from '../../../../utils/date'
import { numberToPercentage } from '../../../../utils/number'

import './data.css'

export default class Data extends PureComponent {
  static propTypes = {
    // State
    data: IICOSelectors._IICODataShape.isRequired,
    tutorialNow: PropTypes.number
  }

  static defaultProps = {
    tutorialNow: null
  }

  calcBonus = percent => {
    const { data } = this.props
    const startTime = data.startTime.getTime()
    const endFullBonusTime = data.endFullBonusTime.getTime()
    const endTime = data.endTime.getTime()
    const time = startTime + percent * (endTime - startTime)

    let bonus
    if (time <= endFullBonusTime) bonus = data.startingBonus
    else if (time >= endTime) bonus = 0
    else
      bonus =
        data.startingBonus * ((endTime - time) / (endTime - endFullBonusTime))

    return `${numberToPercentage(bonus)} - ${dateToString(new Date(time))}`
  }

  render() {
    const { data, tutorialNow } = this.props
    const percentageStartingBonus = numberToPercentage(data.startingBonus)

    // Times
    const now = tutorialNow || Date.now()
    const startTime = data.startTime.getTime()
    const endFullBonusTime = data.endFullBonusTime.getTime()
    const withdrawalLockTime = data.withdrawalLockTime.getTime()
    const endTime = data.endTime.getTime()
    const duration = endTime - startTime

    // Phase
    let phase
    let phaseTooltip
    if (now < startTime) {
      phase = 'Not Started'
      phaseTooltip =
        'The sale has not started yet, look at the slider to see when it will start.'
    } else if (now < endFullBonusTime) {
      phase = 'Full Bonus'
      phaseTooltip = `If you contribute now, you will have a ${percentageStartingBonus} bonus. You can also withdraw your contribution with no penalty.`
    } else if (now < withdrawalLockTime) {
      phase = 'Partial Withdrawals'
      phaseTooltip =
        'You can still withdraw but only partially and with a 1/3 penalty on your bonus.'
    } else if (now < endTime) {
      phase = 'Withdrawal Lockup'
      phaseTooltip = 'You can no longer withdraw.'
    } else {
      phase = 'Finished'
      phaseTooltip =
        'The sale is over, once finalized, you can redeem your tokens and/or refunded ETH.'
    }

    // Slider percents
    let initialPercent
    if (now <= startTime) initialPercent = 0
    else if (now >= endTime) initialPercent = 1
    else initialPercent = (now - startTime) / duration
    const endFullBonusPercent = (endFullBonusTime - startTime) / duration
    const withdrawalLockPercent = (withdrawalLockTime - startTime) / duration

    return (
      <div className="Data">
        <div className="Data-top">
          <StatRow id="joyrideWelcome">
            <StatBlock
              id="joyrideTokenContractAddress"
              label="Token Contract"
              value={<ChainHash>{data.tokenContractAddress}</ChainHash>}
              tooltip="This is the address of the ERC20 contract that holds the tokens for sale."
              noWrap
            />
            <StatBlock
              id="joyrideTokensForSale"
              label="Tokens For Sale"
              value={data.tokensForSale.toLocaleString()}
              tooltip="This is the amount of tokens that are for sale. In other words, the balance of the sale contract."
              noWrap
            />
          </StatRow>
          <StatRow withBoxShadow>
            <StatBlock
              id="joyrideValuation"
              label="Amount Raised (ETH)"
              value={<ChainNumber>{data.valuation || 0}</ChainNumber>}
              tooltip="This is the sum of all contributions that are currently in the sale (not refunded)."
              noWrap
            />
            {data.ethPrice && (
              <StatBlock label="USD/ETH" value={`$${data.ethPrice}`} noWrap />
            )}
            {data.ethPrice && (
              <StatBlock
                label="Amount Raised (USD)"
                value={`$${Math.round(
                  (data.valuation || 0) * data.ethPrice
                ).toLocaleString()}`}
                noWrap
              />
            )}
            <StatBlock
              id="joyridePhase"
              label="Phase"
              value={phase}
              tooltip={phaseTooltip}
              noWrap
            />
          </StatRow>
        </div>
        <StatRow withBoxShadow>
          <StatBlock
            id="joyrideStartingBonus"
            label="Starting Bonus"
            value={percentageStartingBonus}
            tooltip="This is the bonus at the start of the sale and throughout the Full Bonus phase."
            noWrap
          />
          <StatBlock
            id="joyrideCurrentBonus"
            label="Current Bonus"
            value={numberToPercentage(data.bonus)}
            tooltip="This is the current bonus. The one a contribution made right now would get."
            noWrap
          />
          <StatBlock
            id="joyrideSlider"
            value={
              <Slider
                startLabel={`Start: ${dateToString(data.startTime)}`}
                endLabel={`End: ${dateToString(data.endTime)}`}
                initialPercent={initialPercent}
                steps={[
                  { label: 'Full Bonus', percent: endFullBonusPercent },
                  {
                    label: 'Partial Withdrawals',
                    percent: withdrawalLockPercent,
                    color: '#f0ad4e'
                  },
                  { label: 'Withdrawal Lockup', percent: 1, color: '#be6464' },
                  {
                    label: 'Now',
                    percent: initialPercent,
                    color: '#337ab7',
                    point: true
                  }
                ]}
                calcValue={this.calcBonus}
              />
            }
            noBackground
            noWrap
            flexBasis={390}
          />
        </StatRow>
      </div>
    )
  }
}
