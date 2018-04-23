import React, { PureComponent } from 'react'

import * as IICOSelectors from '../../../../reducers/iico'
import StatRow from '../../../../components/stat-row'
import StatBlock from '../../../../components/stat-block'
import ChainHash from '../../../../components/chain-hash'
import ChainNumber from '../../../../components/chain-number'
import PieChart from '../../../../components/pie-chart'
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

    return numberToPercentage(bonus)
  }

  render() {
    const { data } = this.props

    const now = Date.now()
    const startTime = data.startTime.getTime()
    const endTime = data.endTime.getTime()

    let initialPercent
    if (now <= startTime) initialPercent = 0
    else if (now >= endTime) initialPercent = 1
    else initialPercent = (now - startTime) / (endTime - startTime)

    let phase
    if (now < startTime) phase = 'Not Started'
    else if (now < data.endFullBonusTime.getTime()) phase = 'Full Bonus'
    else if (now < data.withdrawalLockTime.getTime()) phase = 'Free Withdrawals'
    else if (now < endTime) phase = 'Automatic Withdrawals'
    else phase = 'Finished'

    const amountCommitted =
      phase === 'Finished'
        ? data.valuation
        : phase === 'Automatic Withdrawals' ? data.amountCommitted : 0

    return (
      <div className="Data">
        <div className="Data-top">
          <div className="Data-top-section">
            <StatRow withBoxShadow>
              <StatBlock
                label="Token Contract"
                value={<ChainHash>{data.tokenContractAddress}</ChainHash>}
              />
              <StatBlock label="Tokens For Sale" value={data.tokensForSale} />
              <StatBlock
                label="Current Token Price"
                value={
                  <ChainNumber>
                    {data.virtualValuation /
                      (data.tokensForSale * (1 + data.bonus))}
                  </ChainNumber>
                }
              />
            </StatRow>
          </div>
          <div className="Data-top-section">
            <StatRow withBoxShadow>
              <StatBlock
                value={
                  <PieChart
                    slice={amountCommitted}
                    total={data.valuation}
                    size={90}
                  />
                }
                noBackground
              />
              <StatBlock
                label="Valuation"
                value={<ChainNumber>{data.valuation}</ChainNumber>}
              />
              <StatBlock
                label="Amount Committed"
                value={<ChainNumber>{amountCommitted}</ChainNumber>}
              />
            </StatRow>
          </div>
        </div>
        <StatRow withBoxShadow>
          <StatBlock label="Phase" value={phase} />
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
