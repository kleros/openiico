import { createActions } from 'lessdux'

/* Actions */

// IICOData
export const IICOData = createActions('$IICO$_DATA')

/* Action Creators */

// IICOData
export const fetchIICOData = address => ({
  type: IICOData.FETCH,
  payload: { address }
})
