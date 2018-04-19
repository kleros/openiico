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
const {
  shape: IICOBidsShape,
  initialState: IICOBidsInitialState
} = createResource(
  PropTypes.arrayOf(
    PropTypes.shape({
      maxVal: PropTypes.number.isRequired,
      contrib: PropTypes.number.isRequired,
      bonus: PropTypes.number.isRequired,
      contributor: PropTypes.string.isRequired,
      withdrawn: PropTypes.bool.isRequired,
      redeemed: PropTypes.bool.isRequired
    }).isRequired
  )
)
export { IICODataShape, IICOBidsShape }

// Reducer
export default createReducer({
  IICOData: IICODataInitialState,
  IICOBids: IICOBidsInitialState
})
