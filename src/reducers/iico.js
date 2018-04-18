import PropTypes from 'prop-types'
import createReducer, { createResource } from 'lessdux'

// Shapes
const {
  shape: IICODataShape,
  initialState: IICODataInitialState
} = createResource(
  PropTypes.shape({
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
  })
)
export { IICODataShape }

// Reducer
export default createReducer({
  IICOData: IICODataInitialState
})

// Selectors
