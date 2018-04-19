import { createActions } from 'lessdux'

/* Actions */

// IICO Data
export const IICOData = createActions('$IICO$_DATA')

// IICO Bids
export const IICOBids = createActions('$IICO$_BIDS')

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
