import React, { PureComponent } from 'react'

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
    data: IICOSelectors._IICODataShape.isRequired
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

    return `${numberToPercentage(bonus)} - ${dateToString(data.startTime)}`
  }

  render() {
    const { data } = this.props

    // Times
    const now = Date.now()
    const startTime = data.startTime.getTime()
    const endTime = data.endTime.getTime()
    const endFullBonusTime = data.endFullBonusTime.getTime()
    const withdrawalLockTime = data.withdrawalLockTime.getTime()
    const duration = endTime - startTime

    // Phase
    let phase
    if (now < startTime) phase = 'Not Started'
    else if (now < endFullBonusTime) phase = 'Full Bonus'
    else if (now < withdrawalLockTime) phase = 'Free Withdrawals'
    else if (now < endTime) phase = 'Automatic Withdrawals'
    else phase = 'Finished'

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
          <StatRow>
            <StatBlock
              label="Token Contract"
              value={<ChainHash>{data.tokenContractAddress}</ChainHash>}
            />
            <StatBlock label="Tokens For Sale" value={data.tokensForSale} />
          </StatRow>
          <StatRow withBoxShadow>
            <StatBlock
              label="Valuation"
              value={<ChainNumber>{data.valuation}</ChainNumber>}
            />
            <StatBlock label="Phase" value={phase} />
          </StatRow>
        </div>
        <StatRow withBoxShadow>
          <StatBlock
            label="Starting Bonus"
            value={numberToPercentage(data.startingBonus)}
          />
          <StatBlock
            label="Current Bonus"
            value={numberToPercentage(data.bonus)}
          />
          <StatBlock
            value={
              <Slider
                startLabel={dateToString(data.startTime)}
                endLabel={dateToString(data.endTime)}
                initialPercent={initialPercent}
                steps={[
                  { label: 'End of Full Bonus', percent: endFullBonusPercent },
                  { label: 'Withdrawal Lock', percent: withdrawalLockPercent },
                  { label: 'Now', percent: initialPercent, color: '#337ab7' }
                ]}
                calcValue={this.calcBonus}
              />
            }
            noBackground
            flexBasis={390}
          />
        </StatRow>
      </div>
    )
  }
}
