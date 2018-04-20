import { createActions } from 'lessdux'

/* Actions */

// IICO Data
export const IICOData = createActions('$IICO$_DATA')

// IICO Bids
export const IICOBids = createActions('$IICO$_BIDS')

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
export const fetchIICOData = address => ({
  type: IICOData.FETCH,
  payload: { address }
})

// IICO Bids
export const fetchIICOBids = address => ({
  type: IICOBids.FETCH,
  payload: { address }
})

// IICO Bid
export const createIICOBid = (address, amount, personalCap) => ({
  type: IICOBid.CREATE,
  payload: { address, amount, personalCap }
})
export const withdrawIICOBid = (address, contributorBidID) => ({
  type: IICOBid.WITHDRAW,
  payload: { address, contributorBidID }
})
export const redeemIICOBid = (address, contributorBidID) => ({
  type: IICOBid.REDEEM,
  payload: { address, contributorBidID }
})
