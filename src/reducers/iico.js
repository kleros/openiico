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
    startTime: PropTypes.number.isRequired,
    endFullBonusTime: PropTypes.number.isRequired,
    withdrawalLockTime: PropTypes.number.isRequired,
    endTime: PropTypes.number.isRequired,

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
