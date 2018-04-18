import { takeLatest, all, call } from 'redux-saga/effects'

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

  const {
    // Token
    tokenContractAddress,
    tokensForSale,

    // Times
    startTime,
    endFullBonusTime,
    withdrawalLockTime,
    endTime,

    // Sale Data
    startingBonus,
    bonus,
    valuationAndAmountCommitted
  } = yield all({
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

  return {
    // Token
    tokenContractAddress: tokenContractAddress[0],
    tokensForSale: tokensForSale[0].toNumber(),

    // Times
    startTime: startTime[0].toNumber(),
    endFullBonusTime: endFullBonusTime[0].toNumber(),
    withdrawalLockTime: withdrawalLockTime[0].toNumber(),
    endTime: endTime[0].toNumber(),

    // Sale Data
    startingBonus: startingBonus[0].toNumber(),
    bonus: bonus[0].toNumber(),
    valuation: valuationAndAmountCommitted[0].toNumber(),
    amountCommitted: valuationAndAmountCommitted[1].toNumber()
  }
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
