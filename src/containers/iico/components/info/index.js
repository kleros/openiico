import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import StatRow from '../../../../components/stat-row'
import StatBlock from '../../../../components/stat-block'
import ChainHash from '../../../../components/chain-hash'
import PieChart from '../../../../components/pie-chart'
import Slider from '../../../../components/slider'
import { dateToString } from '../../../../utils/date'

import './info.css'

export default class Info extends PureComponent {
  static propTypes = {
    // State
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
      amountCommitted: PropTypes.number.isRequired
    }).isRequired
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

    return `${(bonus * 100).toFixed(2)}%`
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

    return (
      <div className="Info">
        <div className="Info-top">
          <div className="Info-top-section">
            <StatRow withBoxShadow>
              <StatBlock
                label="Token Contract"
                value={<ChainHash>{data.tokenContractAddress}</ChainHash>}
              />
              <StatBlock label="Tokens For Sale" value={data.tokensForSale} />
            </StatRow>
          </div>
          <div className="Info-top-section">
            <StatRow withBoxShadow>
              <StatBlock
                value={
                  <PieChart
                    slice={data.amountCommitted}
                    total={data.valuation}
                    size={90}
                  />
                }
                noBackground
              />
              <StatBlock label="Valuation" value={data.valuation} />
              <StatBlock
                label="Amount Committed"
                value={data.amountCommitted}
              />
            </StatRow>
          </div>
        </div>
        <StatRow withBoxShadow>
          <StatBlock
            label="Starting Bonus"
            value={`${(data.startingBonus * 100).toFixed(2)}%`}
          />
          <StatBlock
            label="Current Bonus"
            value={`${(data.bonus * 100).toFixed(2)}%`}
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
          />
        </StatRow>
      </div>
    )
  }
}
