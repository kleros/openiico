import PropTypes from 'prop-types'
import createReducer, { createResource } from 'lessdux'

// Common Shapes
const _IICOBidShape = PropTypes.shape({
  maxVal: PropTypes.number.isRequired,
  contrib: PropTypes.number.isRequired,
  bonus: PropTypes.number.isRequired,
  contributor: PropTypes.string.isRequired,
  withdrawn: PropTypes.bool.isRequired,
  redeemed: PropTypes.bool.isRequired
})

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
    amountCommitted: PropTypes.number.isRequired,
    virtualValuation: PropTypes.number.isRequired
  })
)
const {
  shape: IICOBidsShape,
  initialState: IICOBidsInitialState
} = createResource(PropTypes.arrayOf(_IICOBidShape.isRequired))
const {
  shape: IICOBidShape,
  initialState: IICOBidInitialState
} = createResource(_IICOBidShape)
export { IICODataShape, IICOBidsShape, IICOBidShape }

// Reducer
export default createReducer({
  IICOData: IICODataInitialState,
  IICOBids: IICOBidsInitialState,
  IICOBid: IICOBidInitialState
})

// Selectors
export const getIICOBid = (state, contributorBidID) =>
  state.IICO.IICOBids.data && state.IICO.IICOBids.data[contributorBidID]
