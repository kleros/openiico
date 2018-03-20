import { takeLatest } from 'redux-saga/effects'

import * as IICOActions from '../actions/iico'
import { IICOContractFactory } from '../bootstrap/dapp-api'
import { fetchSaga } from '../utils/saga'

/**
 * Fetches an IICO's data.
 * @returns {object} - The IICO's data.
 */
function* fetchIICOData({ payload: { address } }) {
  // TODO: Verify contract adheres to IICO standard.

  // Load contract
  const contract = IICOContractFactory.at(address)

  // TODO: Fetch data

  return { address }
}

/**
 * The root of the IICO saga.
 */
export default function* IICOSaga() {
  // Accounts
  yield takeLatest(
    IICOActions.IICOData.FETCH,
    fetchSaga,
    IICOActions.IICOData,
    fetchIICOData
  )
}
