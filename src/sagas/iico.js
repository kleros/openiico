import { takeLatest, all, call } from 'redux-saga/effects'

import * as IICOActions from '../actions/iico'
import { IICOContractFactory } from '../bootstrap/dapp-api'
import { fetchSaga } from '../utils/saga'

const parseIICOData = d => ({
  // Token
  tokenContractAddress: d.tokenContractAddress[0],
  tokensForSale: d.tokensForSale[0].toNumber(),

  // Times
  startTime: new Date(d.startTime[0].toNumber() * 1000),
  endFullBonusTime: new Date(d.endFullBonusTime[0].toNumber() * 1000),
  withdrawalLockTime: new Date(d.withdrawalLockTime[0].toNumber() * 1000),
  endTime: new Date(d.endTime[0].toNumber() * 1000),

  // Sale Data
  startingBonus: d.startingBonus[0].toNumber() / 1e9,
  bonus: d.bonus[0].toNumber() / 1e9,
  valuation: d.valuationAndAmountCommitted[0].toNumber(),
  amountCommitted: d.valuationAndAmountCommitted[1].toNumber()
})

/**
 * Fetches an IICO's data.
 * @returns {object} - The IICO's data.
 */
function* fetchIICOData({ payload: { address } }) {
  // TODO: Verify contract adheres to IICO standard.

  // Load contract
  const contract = IICOContractFactory.at(address)

  return parseIICOData(
    yield all({
      // Token
      tokenContractAddress: call(contract.token),
      tokensForSale: call(contract.tokensForSale),

      // Times
      startTime: call(contract.startTime),
      endFullBonusTime: call(contract.endFullBonusTime),
      withdrawalLockTime: call(contract.withdrawalLockTime),
      endTime: call(contract.endTime),

      // Sale Data
      startingBonus: call(contract.maxBonus),
      bonus: call(contract.bonus),
      valuationAndAmountCommitted: call(contract.valuation)
    })
  )
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
