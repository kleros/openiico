import { createActions } from 'lessdux'

/* Actions */

// IICO Data
export const IICOData = {
  ...createActions('$IICO$_DATA', { withUpdate: true }),
  CLEAR: 'CLEAR_$IICO$_DATA',
  FINALIZE: 'FINALIZE_$IICO$_DATA'
}

// IICO Bids
export const IICOBids = {
  ...createActions('$IICO$_BIDS'),
  REDEEM: 'REDEEM_$IICO$_BIDS'
}

// IICO Bid
export const IICOBid = {
  ...createActions('$IICO$_BID', {
    withCreate: true,
    withUpdate: true
  }),
  WITHDRAW: 'WITHDRAW_$IICO$_BID',
  REDEEM: 'REDEEM_$IICO$_BID'
}

/* Action Creators */

// IICO Data
export const clearIICOData = () => ({ type: IICOData.CLEAR })
export const fetchIICOData = address => ({
  type: IICOData.FETCH,
  payload: { address }
})
export const finalizeIICOData = (address, maxIterations) => ({
  type: IICOData.FINALIZE,
  payload: { address, maxIterations }
})

// IICO Bids
export const fetchIICOBids = address => ({
  type: IICOBids.FETCH,
  payload: { address }
})
export const redeemIICOBids = address => ({
  type: IICOBids.REDEEM,
  payload: { address }
})

// IICO Bid
export const createIICOBid = (address, amount, personalCap, noPersonalCap) => ({
  type: IICOBid.CREATE,
  payload: { address, amount, personalCap, noPersonalCap }
})
export const withdrawIICOBid = (address, bidID) => ({
  type: IICOBid.WITHDRAW,
  payload: { address, bidID }
})
export const redeemIICOBid = (address, bidID) => ({
  type: IICOBid.REDEEM,
  payload: { address, bidID }
})
