import PropTypes from 'prop-types'
import createReducer, { createResource } from 'lessdux'

import * as IICOActions from '../actions/iico'

// Common Shapes
export const _IICODataShape = PropTypes.shape({
  address: PropTypes.string.isRequired,

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
  virtualValuation: PropTypes.number.isRequired,
  finalized: PropTypes.bool.isRequired
})
export const _IICOBidShape = PropTypes.shape({
  maxVal: PropTypes.number.isRequired,
  contrib: PropTypes.number.isRequired,
  bonus: PropTypes.number.isRequired,
  contributor: PropTypes.string.isRequired,
  withdrawn: PropTypes.bool.isRequired,
  redeemed: PropTypes.bool.isRequired
})
export const _IICOBidsShape = PropTypes.arrayOf(_IICOBidShape.isRequired)

// Shapes
const {
  shape: IICODataShape,
  initialState: IICODataInitialState
} = createResource(_IICODataShape, {
  withUpdate: true
})
const {
  shape: IICOBidsShape,
  initialState: IICOBidsInitialState
} = createResource(_IICOBidsShape)
const {
  shape: IICOBidShape,
  initialState: IICOBidInitialState
} = createResource(_IICOBidShape, {
  withCreate: true,
  withUpdate: true
})
export { IICODataShape, IICOBidsShape, IICOBidShape }

// Reducer
const initialState = {
  IICOData: IICODataInitialState,
  IICOBids: IICOBidsInitialState,
  IICOBid: IICOBidInitialState
}
export default createReducer(initialState, {
  [IICOActions.IICOData.CLEAR]: () => initialState
})

// Selectors
export const getIICOBid = (state, contributorBidID) =>
  state.IICO.IICOBids.data && state.IICO.IICOBids.data[contributorBidID]
